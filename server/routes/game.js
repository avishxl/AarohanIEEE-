const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const { getQuestionsForSession, getMixedQuestions } = require('../data/questions');
const { generateAIQuestion, generateAISession } = require('../ai/questionGenerator');
const { buildAdaptiveSession, getNextDifficulty } = require('../ai/adaptiveDifficulty');
// redis cache removed - caused question repetition across games
const router = express.Router();

const BADGES = [
  { id: 'first_game',    name: 'First Mission',       icon: '🎯', description: 'Complete your first game',              condition: u => u.gamesPlayed >= 1 },
  { id: 'perfect_score', name: 'Perfect Defense',      icon: '🛡️', description: 'Score 100% accuracy in a game',         condition: (u, game) => game?.accuracy === 100 },
  { id: 'streak_5',      name: 'On Fire',              icon: '🔥', description: 'Achieve a 5-question streak',           condition: (u, game) => game?.streak >= 5 },
  { id: 'streak_10',     name: 'Unstoppable',          icon: '⚡', description: 'Achieve a 10-question streak',          condition: (u, game) => game?.streak >= 10 },
  { id: 'phishing_pro',  name: 'Phishing Pro',         icon: '🎣', description: 'Master phishing detection',             condition: u => u.skills?.phishing >= 80 },
  { id: 'games_10',      name: 'Dedicated Defender',   icon: '💪', description: 'Play 10 games',                        condition: u => u.gamesPlayed >= 10 },
  { id: 'games_50',      name: 'Cyber Veteran',        icon: '🏆', description: 'Play 50 games',                        condition: u => u.gamesPlayed >= 50 },
  { id: 'score_1000',    name: 'Point Collector',      icon: '💰', description: 'Reach 1,000 total score',              condition: u => u.totalScore >= 1000 },
  { id: 'score_10000',   name: 'Cyber Elite',          icon: '💎', description: 'Reach 10,000 total score',             condition: u => u.totalScore >= 10000 },
  { id: 'all_modes',     name: 'Renaissance Defender', icon: '🌟', description: 'Play all 10 attack categories',        condition: u => Object.values(u.skills || {}).filter(v => v > 0).length >= 8 },
];

function checkAndAwardBadges(user, gameResult) {
  const newBadges = [];
  const existingIds = user.badges.map(b => b.id);
  for (const badge of BADGES) {
    if (!existingIds.includes(badge.id) && badge.condition(user, gameResult)) {
      newBadges.push({ ...badge, earnedAt: new Date() });
    }
  }
  return newBadges;
}

// GET /api/game/questions/:mode
router.get('/questions/:mode', auth, async (req, res) => {
  try {
    const { mode } = req.params;
    const { difficulty = 'all', count = 8, ai = 'false' } = req.query;
    const user = req.user;

    let questions = [];
    const totalCount = parseInt(count) || 10;
    const currentUser = req.user;

    // NOTE: removed Redis caching; returning fresh questions each request
    // Caching by mode caused users to receive identical question sets repeatedly.

    // Use Adaptive Difficulty Engine (as shown in PDF architecture)
    let adaptiveResult = null;
    try {
      adaptiveResult = await buildAdaptiveSession(
        currentUser.skills || {},
        mode,
        (cat, n, diff) => {
          if (!cat || cat === 'mixed') return getMixedQuestions(n, diff);
          return getQuestionsForSession(cat, n, diff);
        },
        process.env.GEMINI_API_KEY ? generateAIQuestion : null,
        totalCount
      );
      questions = adaptiveResult.questions;
    } catch (err) {
      console.error('Adaptive engine error, falling back:', err.message);
    }

    // Fallback: direct fetch if adaptive fails
    if (!questions.length) {
      if (process.env.GEMINI_API_KEY) {
        const aiCat = mode === 'mixed'
          ? ['phishing','popup','url','social','ransomware','qrcode','vishing','insider','wifi','password','fakelogin'][Math.floor(Math.random()*11)]
          : mode;
        const aiQuestions = await generateAISession(aiCat, 3);
        questions = [...aiQuestions];
      }
      const staticCount = totalCount - questions.length;
      questions = [...questions, ...(mode === 'mixed' ? getMixedQuestions(staticCount, difficulty) : getQuestionsForSession(mode, staticCount, difficulty))];
      questions = questions.sort(() => Math.random() - 0.5);
    }

    // Final shuffle
    questions = questions.sort(() => Math.random() - 0.5);

    // Remove answer from response (client shouldn't know upfront)
    const clientQuestions = questions.map(q => ({
      id: q.id, category: q.category, difficulty: q.difficulty,
      points: q.points, scenario: q.scenario, isAIGenerated: q.isAIGenerated || false,
      options: q.options || null,
      _adaptiveDifficulty: q._adaptiveDifficulty,
      _targetedWeak: q._targetedWeak
    }));

    const sessionId = `session_${Date.now()}`;
    const responseData = {
      questions: clientQuestions,
      sessionId,
      adaptive: adaptiveResult ? {
        startingDifficulty: adaptiveResult.startingDifficulty,
        weakCategoriesTargeted: adaptiveResult.weakCategoriesTargeted
      } : null
    };


    res.json(responseData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/game/answer — validate answer and return result
router.post('/answer', auth, async (req, res) => {
  try {
    const { questionId, answer, category, timeTaken } = req.body;
    const { QUESTION_BANK } = require('../data/questions');

    // Find the question
    let question = null;
    if (questionId.startsWith('ai_')) {
      // AI questions are validated differently — store in session
      return res.json({ correct: true, explanation: 'AI-generated question', redFlags: [] });
    }
    const allQuestions = Object.values(QUESTION_BANK).flat();
    question = allQuestions.find(q => q.id === questionId);

    if (!question) return res.status(404).json({ error: 'Question not found' });

    const isCorrect = answer === question.answer;
    const timeBonus = Math.max(0, Math.round(50 - (timeTaken || 0) * 2));
    const pointsEarned = isCorrect ? (question.points + timeBonus) : 0;

    res.json({
      correct: isCorrect,
      correctAnswer: question.answer,
      explanation: question.explanation,
      redFlags: question.redFlags || [],
      pointsEarned,
      timeBonus
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/game/complete — save game result and update stats
router.post('/complete', auth, async (req, res) => {
  try {
    const { mode, score, correct, total, accuracy, difficulty, bestStreak, skillScores } = req.body;
    const user = await User.findById(req.userId);

    // Update stats
    user.totalScore += score;
    user.gamesPlayed += 1;
    user.totalCorrect += correct;
    user.totalAnswered += total;
    if (score > user.bestScore) user.bestScore = score;
    if (bestStreak > user.bestStreak) user.bestStreak = bestStreak;
    user.xp += Math.round(score * 0.1) + (accuracy === 100 ? 50 : 0);

    // Update skill scores per category
    if (skillScores) {
      Object.keys(skillScores).forEach(cat => {
        if (user.skills[cat] !== undefined) {
          const prev = user.skills[cat];
          user.skills[cat] = Math.round((prev * 0.7) + (skillScores[cat] * 0.3));
        }
      });
    }

    // Save game history (keep last 20)
    user.gameHistory.unshift({ mode, score, correct, total, accuracy, difficulty });
    if (user.gameHistory.length > 20) user.gameHistory = user.gameHistory.slice(0, 20);

    user.updateRank();

    // Check badges
    const newBadges = checkAndAwardBadges(user, { accuracy, streak: bestStreak });
    user.badges.push(...newBadges);

    await user.save();

    res.json({
      success: true,
      newBadges,
      rank: user.rank,
      level: user.level,
      xp: user.xp,
      totalScore: user.totalScore,
      skills: user.skills
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
