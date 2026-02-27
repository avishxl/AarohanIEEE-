// Real-time socket events for leaderboard and live game activity
const User = require('../models/User');

const connectedUsers = new Map(); // socketId -> { userId, username, currentMode, score }
let cachedLeaderboard = [];       // in-memory cache to avoid DB hammering
let lastLeaderboardFetch = 0;

// Refresh leaderboard from DB (max once per 5 seconds)
const refreshLeaderboard = async (io) => {
  const now = Date.now();
  if (now - lastLeaderboardFetch < 5000 && cachedLeaderboard.length > 0) {
    return cachedLeaderboard;
  }
  try {
    const top = await User.find({})
      .select('username rank level totalScore bestScore gamesPlayed badges')
      .sort({ totalScore: -1 })
      .limit(15)
      .lean();
    cachedLeaderboard = top.map((u, i) => ({
      position: i + 1,
      username: u.username,
      rankTitle: u.rank,
      level: u.level,
      totalScore: u.totalScore,
      bestScore: u.bestScore,
      gamesPlayed: u.gamesPlayed,
      topBadge: u.badges?.slice(-1)[0] || null
    }));
    lastLeaderboardFetch = now;
    if (io) io.to('global').emit('leaderboard:update', cachedLeaderboard);
    return cachedLeaderboard;
  } catch (err) {
    console.error('Leaderboard refresh error:', err.message);
    return cachedLeaderboard;
  }
};

const initSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // ── User joins ──────────────────────────────────────────
    socket.on('user:join', async ({ userId, username }) => {
      connectedUsers.set(socket.id, { userId, username, currentMode: null, score: 0 });
      socket.join('global');

      // Send current online count to everyone
      io.to('global').emit('users:online', connectedUsers.size);

      // Send leaderboard to this new user immediately
      const lb = await refreshLeaderboard(null);
      socket.emit('leaderboard:update', lb);

      // Announce this user joined (for live feed)
      socket.to('global').emit('game:activity', {
        type: 'join',
        username,
        message: `${username} joined the training`,
        timestamp: new Date()
      });

      console.log(`👤 ${username} connected (${connectedUsers.size} online)`);
    });

    // ── Game started ────────────────────────────────────────
    socket.on('game:started', ({ mode }) => {
      const user = connectedUsers.get(socket.id);
      if (!user) return;
      user.currentMode = mode;
      user.score = 0;
      connectedUsers.set(socket.id, user);

      io.to('global').emit('game:activity', {
        type: 'started',
        username: user.username,
        mode,
        message: `${user.username} started ${mode} training`,
        timestamp: new Date()
      });
    });

    // ── Answer submitted (live reaction) ────────────────────
    socket.on('game:answered', ({ correct, streak }) => {
      const user = connectedUsers.get(socket.id);
      if (!user) return;

      if (streak >= 5) {
        io.to('global').emit('game:activity', {
          type: 'streak',
          username: user.username,
          streak,
          message: `🔥 ${user.username} is on a ${streak}x streak!`,
          timestamp: new Date()
        });
      }
    });

    // ── Game completed — update score and refresh leaderboard
    socket.on('game:score_update', async ({ username, score, mode, accuracy }) => {
      const user = connectedUsers.get(socket.id);
      if (user) { user.score = score; connectedUsers.set(socket.id, user); }

      // Broadcast to all users that someone just scored
      io.to('global').emit('game:activity', {
        type: 'completed',
        username,
        score,
        mode,
        accuracy,
        message: `${username} scored ${score.toLocaleString()} pts in ${mode} (${accuracy}% accuracy)`,
        timestamp: new Date()
      });

      // Force leaderboard refresh
      lastLeaderboardFetch = 0;
      await refreshLeaderboard(io);
    });

    // ── Periodic leaderboard ping (client requests refresh) ─
    socket.on('leaderboard:request', async () => {
      const lb = await refreshLeaderboard(null);
      socket.emit('leaderboard:update', lb);
    });

    // ── Disconnect ──────────────────────────────────────────
    socket.on('disconnect', () => {
      const user = connectedUsers.get(socket.id);
      connectedUsers.delete(socket.id);
      io.to('global').emit('users:online', connectedUsers.size);
      if (user) {
        console.log(`👋 ${user.username} disconnected (${connectedUsers.size} online)`);
      }
    });
  });

  // Auto-refresh leaderboard every 30 seconds to catch any missed updates
  setInterval(() => refreshLeaderboard(io), 30000);
};

module.exports = { initSocket };
