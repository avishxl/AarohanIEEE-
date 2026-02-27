const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const badgeSchema = new mongoose.Schema({
  id: String,
  name: String,
  icon: String,
  description: String,
  earnedAt: { type: Date, default: Date.now }
});

const skillSchema = new mongoose.Schema({
  phishing:     { type: Number, default: 0 },
  popup:        { type: Number, default: 0 },
  url:          { type: Number, default: 0 },
  password:     { type: Number, default: 0 },
  social:       { type: Number, default: 0 },
  ransomware:   { type: Number, default: 0 },
  qrcode:       { type: Number, default: 0 },
  vishing:      { type: Number, default: 0 },
  insider:      { type: Number, default: 0 },
  wifi:         { type: Number, default: 0 }
});

const userSchema = new mongoose.Schema({
  username:     { type: String, required: true, unique: true, trim: true, minlength: 3 },
  email:        { type: String, required: true, unique: true, lowercase: true },
  password:     { type: String, required: true, minlength: 6 },
  avatar:       { type: String, default: '' },
  totalScore:   { type: Number, default: 0 },
  bestScore:    { type: Number, default: 0 },
  gamesPlayed:  { type: Number, default: 0 },
  totalCorrect: { type: Number, default: 0 },
  totalAnswered:{ type: Number, default: 0 },
  currentStreak:{ type: Number, default: 0 },
  bestStreak:   { type: Number, default: 0 },
  level:        { type: Number, default: 1 },
  xp:           { type: Number, default: 0 },
  rank:         { type: String, default: 'Rookie' },
  skills:       { type: skillSchema, default: () => ({}) },
  badges:       [badgeSchema],
  gameHistory:  [{
    mode:       String,
    score:      Number,
    correct:    Number,
    total:      Number,
    accuracy:   Number,
    difficulty: String,
    playedAt:   { type: Date, default: Date.now }
  }],
  createdAt:    { type: Date, default: Date.now }
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update rank based on total score
userSchema.methods.updateRank = function() {
  const ranks = [
    { min: 0,     name: 'Rookie',        icon: '🥉' },
    { min: 500,   name: 'Apprentice',    icon: '🔵' },
    { min: 1500,  name: 'Defender',      icon: '🛡️' },
    { min: 3000,  name: 'Analyst',       icon: '🔍' },
    { min: 6000,  name: 'Hunter',        icon: '⚡' },
    { min: 10000, name: 'Expert',        icon: '🏆' },
    { min: 20000, name: 'Elite',         icon: '💎' },
    { min: 50000, name: 'Cyber Legend',  icon: '🌟' }
  ];
  const rank = [...ranks].reverse().find(r => this.totalScore >= r.min);
  this.rank = `${rank.icon} ${rank.name}`;
  this.level = ranks.indexOf(ranks.find(r => r.name === rank.name)) + 1;
};

module.exports = mongoose.model('User', userSchema);
