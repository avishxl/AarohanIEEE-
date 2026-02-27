const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// GET /api/user/profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    const rank = await User.countDocuments({ totalScore: { $gt: user.totalScore } }) + 1;
    res.json({ user, globalRank: rank });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/user/stats
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    const accuracy = user.totalAnswered > 0
      ? Math.round((user.totalCorrect / user.totalAnswered) * 100) : 0;

    res.json({
      totalScore: user.totalScore,
      bestScore: user.bestScore,
      gamesPlayed: user.gamesPlayed,
      accuracy,
      bestStreak: user.bestStreak,
      rank: user.rank,
      level: user.level,
      xp: user.xp,
      skills: user.skills,
      badges: user.badges,
      recentGames: user.gameHistory.slice(0, 5)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
