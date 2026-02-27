// Redis client — gracefully falls back to in-memory if Redis not available
// This means the app works with OR without Redis running
const Redis = require('ioredis');

let client = null;
let useRedis = false;

// In-memory fallback store
const memStore = new Map();

const initRedis = async () => {
  try {
    client = new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      connectTimeout: 3000,
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      lazyConnect: true,
    });

    await client.connect();
    await client.ping();
    useRedis = true;
    console.log('✅ Redis connected');
  } catch (err) {
    console.log('⚠️  Redis not available — using in-memory cache (leaderboard still works)');
    useRedis = false;
    client = null;
  }
};

// Universal get/set/del that works with or without Redis
const cache = {
  async get(key) {
    if (useRedis && client) {
      const val = await client.get(key);
      return val ? JSON.parse(val) : null;
    }
    return memStore.get(key) || null;
  },

  async set(key, value, ttlSeconds = 60) {
    const serialized = JSON.stringify(value);
    if (useRedis && client) {
      await client.setex(key, ttlSeconds, serialized);
    } else {
      memStore.set(key, value);
      // Auto-expire from memory store
      setTimeout(() => memStore.delete(key), ttlSeconds * 1000);
    }
  },

  async del(key) {
    if (useRedis && client) await client.del(key);
    else memStore.delete(key);
  },

  // Leaderboard sorted set operations
  async zset(key, score, member) {
    if (useRedis && client) {
      await client.zadd(key, score, member);
    } else {
      const board = memStore.get(key) || [];
      const idx = board.findIndex(e => e.member === member);
      if (idx >= 0) board[idx].score = score;
      else board.push({ score, member });
      board.sort((a, b) => b.score - a.score);
      memStore.set(key, board);
    }
  },

  async zrange(key, start, stop) {
    if (useRedis && client) {
      return client.zrevrange(key, start, stop, 'WITHSCORES');
    }
    const board = memStore.get(key) || [];
    return board.slice(start, stop + 1);
  },

  isRedisActive: () => useRedis,
};

module.exports = { initRedis, cache };
