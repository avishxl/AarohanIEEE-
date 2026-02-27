const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// GET /api/leaderboard/global
router.get('/global', async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const users = await User.find({})
      .select('username rank level totalScore bestScore gamesPlayed badges')
      .sort({ totalScore: -1 })
      .limit(parseInt(limit));

    const leaderboard = users.map((u, i) => ({
      rank: i + 1,
      username: u.username,
      rankTitle: u.rank,
      level: u.level,
      totalScore: u.totalScore,
      bestScore: u.bestScore,
      gamesPlayed: u.gamesPlayed,
      topBadge: u.badges.length > 0 ? u.badges[u.badges.length - 1] : null
    }));
    res.json({ leaderboard });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/leaderboard/me
router.get('/me', auth, async (req, res) => {
  try {
    const myScore = req.user.totalScore;
    const rank = await User.countDocuments({ totalScore: { $gt: myScore } }) + 1;
    const total = await User.countDocuments();
    res.json({ rank, total, percentile: Math.round(((total - rank) / total) * 100) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
