require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const { initRedis } = require('./utils/redis');

const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/game');
const leaderboardRoutes = require('./routes/leaderboard');
const userRoutes = require('./routes/user');
const { initSocket } = require('./socket/gameSocket');

const app = express();
const server = http.createServer(app);

// Allowed origins - support dev ports
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175',
  process.env.CLIENT_URL
].filter(Boolean);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use('/api/', limiter);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cybershield')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB error:', err));

// Redis connection (with graceful fallback)
initRedis();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/user', userRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ 
  status: 'ok', 
  time: new Date(),
  features: {
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    gemini: !!process.env.GEMINI_API_KEY,
    adaptiveDifficulty: true,
    attackModules: 11
  }
}));

// Root route
app.get('/', (req, res) => res.json({ 
  message: '🛡️ CyberShield Backend API',
  version: '1.0.0',
  status: 'running',
  docs: 'POST /api/auth/register - Register\nPOST /api/auth/login - Login\nGET /api/health - Health Check'
}));

// Socket.io game events
initSocket(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 CyberShield server running on port ${PORT}`));

module.exports = { app, io };
