import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'

// Configure axios
axios.defaults.baseURL = 'http://localhost:5000'

// Auth Store
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          const res = await axios.post('/api/auth/login', { email, password })
          set({ user: res.data.user, token: res.data.token, isLoading: false })
          axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
          return true
        } catch (err) {
          set({ error: err.response?.data?.error || 'Login failed', isLoading: false })
          return false
        }
      },

      register: async (username, email, password) => {
        set({ isLoading: true, error: null })
        try {
          const res = await axios.post('/api/auth/register', { username, email, password })
          set({ user: res.data.user, token: res.data.token, isLoading: false })
          axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
          return true
        } catch (err) {
          set({ error: err.response?.data?.error || 'Registration failed', isLoading: false })
          return false
        }
      },

      logout: () => {
        set({ user: null, token: null })
        delete axios.defaults.headers.common['Authorization']
      },

      updateUser: (updates) => set(s => ({ user: { ...s.user, ...updates } })),

      initAuth: () => {
        const { token } = get()
        if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      }
    }),
    { name: 'cybershield-auth', partialize: s => ({ token: s.token, user: s.user }) }
  )
)

// Game Store
export const useGameStore = create((set, get) => ({
  // Session state
  mode: 'mixed',
  difficulty: 'all',
  questions: [],
  currentIndex: 0,
  sessionId: null,

  // Score state
  score: 0,
  lives: 3,
  streak: 0,
  bestStreak: 0,
  correctCount: 0,
  wrongCount: 0,

  // UI state
  phase: 'home', // home | game | result
  isAnswered: false,
  lastResult: null, // { correct, explanation, redFlags, pointsEarned }
  skillScores: {}, // category -> accuracy for this session

  // Leaderboard
  onlineUsers: 0,
  liveActivity: [],
  leaderboard: [],

  // Actions
  setMode: (mode) => set({ mode }),
  setDifficulty: (difficulty) => set({ difficulty }),

  startGame: (questions, sessionId) => set({
    questions, sessionId,
    currentIndex: 0, score: 0, lives: 3, streak: 0,
    bestStreak: 0, correctCount: 0, wrongCount: 0,
    phase: 'game', isAnswered: false, lastResult: null,
    skillScores: {}
  }),

  submitAnswer: (result) => {
    const state = get()
    const newState = { isAnswered: true, lastResult: result }

    if (result.correct) {
      const newStreak = state.streak + 1
      const newBestStreak = Math.max(newStreak, state.bestStreak)
      newState.streak = newStreak
      newState.bestStreak = newBestStreak
      newState.score = state.score + (result.pointsEarned || 100)
      newState.correctCount = state.correctCount + 1
    } else {
      newState.streak = 0
      newState.lives = state.lives - 1
      newState.wrongCount = state.wrongCount + 1
    }

    // Update skill score for current question's category
    const q = state.questions[state.currentIndex]
    if (q?.category) {
      const prev = state.skillScores[q.category] || { correct: 0, total: 0 }
      newState.skillScores = {
        ...state.skillScores,
        [q.category]: {
          correct: prev.correct + (result.correct ? 1 : 0),
          total: prev.total + 1
        }
      }
    }
    set(newState)
  },

  nextQuestion: () => {
    const state = get()
    const nextIndex = state.currentIndex + 1
    const isOver = nextIndex >= state.questions.length || state.lives <= 0
    if (isOver) {
      set({ phase: 'result', isAnswered: false })
    } else {
      set({ currentIndex: nextIndex, isAnswered: false, lastResult: null })
    }
  },

  goHome: () => set({ phase: 'home' }),

  // Restart the current session using existing questions
  restartGame: () => {
    const state = get()
    set({
      currentIndex: 0,
      score: 0,
      lives: 3,
      streak: 0,
      bestStreak: 0,
      correctCount: 0,
      wrongCount: 0,
      phase: 'game',
      isAnswered: false,
      lastResult: null,
      skillScores: {}
    })
  },

  addLiveActivity: (activity) => set(s => ({
    liveActivity: [activity, ...s.liveActivity].slice(0, 5)
  })),

  setLeaderboard: (lb) => set({ leaderboard: lb }),
  setOnlineUsers: (n) => set({ onlineUsers: n }),
}))
