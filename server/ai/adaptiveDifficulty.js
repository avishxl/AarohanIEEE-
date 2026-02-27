/**
 * CyberShield — Adaptive Difficulty Engine
 * 
 * Architecture: As shown in PDF slide 5
 * User Login → Game Session → Gemini Generates Questions →
 * → Adaptive Difficulty Engine → Player Answers → Live Score → Leaderboard
 * 
 * How it works:
 * - Tracks rolling accuracy per session (last 3 answers)
 * - If accuracy > 75% → escalate to harder questions
 * - If accuracy < 40% → drop to easier questions
 * - Targets weakest categories from user's skill profile
 */

// Difficulty levels ordered
const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard'];

/**
 * Calculate next difficulty based on recent performance
 * @param {Array} recentAnswers - last N answers [{correct, difficulty, category}]
 * @param {String} currentDifficulty - current level
 * @returns {String} - next difficulty
 */
const getNextDifficulty = (recentAnswers, currentDifficulty = 'medium') => {
  if (!recentAnswers || recentAnswers.length < 2) return currentDifficulty;

  // Only look at last 3 answers for rolling window
  const window = recentAnswers.slice(-3);
  const correctInWindow = window.filter(a => a.correct).length;
  const accuracy = correctInWindow / window.length;

  const currentIdx = DIFFICULTY_LEVELS.indexOf(currentDifficulty);

  if (accuracy >= 0.8 && currentIdx < 2) {
    // Performing well — escalate
    return DIFFICULTY_LEVELS[currentIdx + 1];
  } else if (accuracy <= 0.33 && currentIdx > 0) {
    // Struggling — drop down
    return DIFFICULTY_LEVELS[currentIdx - 1];
  }

  return currentDifficulty;
};

/**
 * Get weakest categories from user's skill profile
 * @param {Object} skills - {phishing: 45, popup: 80, ...}
 * @param {Number} count - how many weak categories to return
 * @returns {Array} - sorted weak categories
 */
const getWeakCategories = (skills = {}, count = 3) => {
  return Object.entries(skills)
    .filter(([, score]) => score > 0) // Has been played
    .sort(([, a], [, b]) => a - b)    // Lowest score first
    .slice(0, count)
    .map(([cat]) => cat);
};

/**
 * Build an adaptive question set for a session
 * Prioritizes weak categories and adjusts difficulty dynamically
 * 
 * @param {Object} userSkills - User's skill profile from DB
 * @param {String} mode - selected game mode
 * @param {Function} getStaticQuestions - static question fetcher
 * @param {Function} generateAI - AI question generator
 * @param {Number} totalCount - target question count
 */
const buildAdaptiveSession = async (
  userSkills = {},
  mode = 'mixed',
  getStaticQuestions,
  generateAI,
  totalCount = 10
) => {
  const questions = [];
  let startingDifficulty = 'easy'; // Always start accessible

  // Determine starting difficulty based on overall skill level
  const allScores = Object.values(userSkills).filter(s => s > 0);
  if (allScores.length > 0) {
    const avgScore = allScores.reduce((a, b) => a + b, 0) / allScores.length;
    if (avgScore > 70) startingDifficulty = 'medium';
    if (avgScore > 85) startingDifficulty = 'hard';
  }

  const weakCategories = getWeakCategories(userSkills, 3);

  // Question progression plan:
  // Q1-2: starting difficulty (warm up)
  // Q3-5: medium (build up)
  // Q6-8: based on performance (adaptive)
  // Q9-10: target weak categories specifically

  const plan = [
    { diff: startingDifficulty,                    targetWeak: false },
    { diff: startingDifficulty,                    targetWeak: false },
    { diff: 'medium',                              targetWeak: false },
    { diff: 'medium',                              targetWeak: true  },
    { diff: 'medium',                              targetWeak: true  },
    { diff: 'hard',                                targetWeak: false },
    { diff: 'hard',                                targetWeak: true  },
    { diff: 'hard',                                targetWeak: true  },
    { diff: 'hard',                                targetWeak: true  },
    { diff: 'hard',                                targetWeak: false },
  ].slice(0, totalCount);

  for (const slot of plan) {
    let cat = mode === 'mixed'
      ? (slot.targetWeak && weakCategories.length > 0
          ? weakCategories[Math.floor(Math.random() * weakCategories.length)]
          : null) // null = random
      : mode;

    // Try AI first (30% of questions)
    let question = null;
    if (Math.random() < 0.3 && generateAI) {
      question = await generateAI(cat || mode);
    }

    // Fallback to static
    if (!question && getStaticQuestions) {
      const staticQ = getStaticQuestions(cat || mode, 1, slot.diff);
      question = staticQ[0] || null;
    }

    if (question) {
      question._adaptiveDifficulty = slot.diff;
      question._targetedWeak = slot.targetWeak;
      questions.push(question);
    }
  }

  return {
    questions: questions.sort(() => Math.random() - 0.5), // Shuffle order slightly
    startingDifficulty,
    weakCategoriesTargeted: weakCategories,
    isAdaptive: true
  };
};

module.exports = { getNextDifficulty, getWeakCategories, buildAdaptiveSession, DIFFICULTY_LEVELS };
