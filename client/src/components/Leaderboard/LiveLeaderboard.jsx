import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore, useAuthStore } from '../../store'
import { useSocket } from '../../hooks/useSocket'

const MEDAL = ['🥇', '🥈', '🥉']
const ACTIVITY_ICONS = {
  join:      '👋',
  started:   '▶️',
  completed: '🏁',
  streak:    '🔥'
}

export default function LiveLeaderboard() {
  const { leaderboard, onlineUsers, liveActivity } = useGameStore()
  const { user } = useAuthStore()
  const { requestLeaderboard } = useSocket()
  const prevScores = useRef({})

  // Request fresh leaderboard on mount
  useEffect(() => { requestLeaderboard() }, [])

  // Track score changes to flash animation
  const getScoreChange = (entry) => {
    const prev = prevScores.current[entry.username]
    if (prev !== undefined && entry.totalScore > prev) return entry.totalScore - prev
    return null
  }
  useEffect(() => {
    leaderboard.forEach(e => { prevScores.current[e.username] = e.totalScore })
  }, [leaderboard])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>

      {/* ── Online Users ──────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.15)', borderRadius: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}
            style={{ width: 8, height: 8, background: '#00ff88', borderRadius: '50%' }} />
          <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#00ff88', letterSpacing: 1 }}>LIVE</span>
        </div>
        <span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: '#e8e8f0' }}>
          {onlineUsers} <span style={{ color: '#6666aa', fontWeight: 400 }}>online now</span>
        </span>
      </div>

      {/* ── Live Activity Feed ────────────────────────────── */}
      <div style={{ background: '#12121a', border: '1px solid #2a2a40', borderRadius: 12, padding: '12px 14px' }}>
        <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#6666aa', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>
          ⚡ Live Activity
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minHeight: 72 }}>
          <AnimatePresence initial={false}>
            {liveActivity.length === 0 ? (
              <div style={{ color: '#333355', fontSize: 12, textAlign: 'center', padding: '16px 0', fontFamily: 'monospace' }}>
                Waiting for players...
              </div>
            ) : liveActivity.slice(0, 4).map((a, i) => (
              <motion.div key={`${a.timestamp}-${i}`}
                initial={{ opacity: 0, x: 20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '6px 8px', background: '#1a1a28', borderRadius: 7 }}>
                <span style={{ fontSize: 13, flexShrink: 0 }}>{ACTIVITY_ICONS[a.type] || '●'}</span>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 12, color: '#e8e8f0', lineHeight: 1.4 }}>
                    <strong style={{ color: a.type === 'streak' ? '#ffd700' : '#00ff88' }}>{a.username}</strong>
                    {' '}
                    <span style={{ color: '#6666aa' }}>
                      {a.type === 'completed' ? `scored ${a.score?.toLocaleString()} pts` :
                       a.type === 'started'   ? `started ${a.mode}` :
                       a.type === 'streak'    ? `🔥 ${a.streak}x streak!` :
                       'joined training'}
                    </span>
                  </span>
                  {a.type === 'completed' && a.accuracy && (
                    <div style={{ fontSize: 10, color: '#4444aa', fontFamily: 'monospace', marginTop: 2 }}>
                      {a.accuracy}% accuracy · {a.mode}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Global Leaderboard ────────────────────────────── */}
      <div style={{ background: '#12121a', border: '1px solid #2a2a40', borderRadius: 12, padding: '14px', flex: 1, overflow: 'hidden' }}>
        <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#6666aa', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>🏆 Global Leaderboard</span>
          <span style={{ color: '#333355', fontSize: 9 }}>updates live</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <AnimatePresence>
            {leaderboard.length === 0 ? (
              <div style={{ color: '#333355', fontSize: 12, textAlign: 'center', padding: '20px 0', fontFamily: 'monospace' }}>
                No scores yet — be first! 🚀
              </div>
            ) : leaderboard.slice(0, 12).map((entry, i) => {
              const isMe = entry.username === user?.username
              const scoreChange = getScoreChange(entry)
              return (
                <motion.div key={entry.username}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 10px', borderRadius: 8,
                    background: isMe ? 'rgba(0,255,136,0.07)' : i < 3 ? 'rgba(255,215,0,0.04)' : '#1a1a28',
                    border: isMe ? '1px solid rgba(0,255,136,0.2)' : '1px solid transparent',
                    position: 'relative', overflow: 'hidden'
                  }}>

                  {/* Score change flash */}
                  {scoreChange && (
                    <motion.div initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 1.5 }}
                      style={{ position: 'absolute', inset: 0, background: 'rgba(0,255,136,0.1)', borderRadius: 8, pointerEvents: 'none' }} />
                  )}

                  {/* Position */}
                  <span style={{ fontFamily: 'monospace', fontSize: 13, minWidth: 24, textAlign: 'center', fontWeight: 700, color: i === 0 ? '#ffd700' : i === 1 ? '#aaaaaa' : i === 2 ? '#cd7f32' : '#333366' }}>
                    {i < 3 ? MEDAL[i] : `${i + 1}`}
                  </span>

                  {/* User info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: isMe ? '#00ff88' : '#e8e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {entry.username} {isMe && <span style={{ fontSize: 9, color: '#6666aa' }}>(you)</span>}
                    </div>
                    <div style={{ fontSize: 9, color: '#00ff88', fontFamily: 'monospace', marginTop: 1 }}>
                      {entry.rankTitle}
                    </div>
                  </div>

                  {/* Score */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: i < 3 ? '#ffd700' : '#e8e8f0' }}>
                      {entry.totalScore?.toLocaleString()}
                    </div>
                    {scoreChange && (
                      <motion.div initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -10 }} transition={{ duration: 1 }}
                        style={{ fontFamily: 'monospace', fontSize: 9, color: '#00ff88', position: 'absolute', right: 10 }}>
                        +{scoreChange}
                      </motion.div>
                    )}
                    <div style={{ fontSize: 9, color: '#444466', fontFamily: 'monospace' }}>
                      {entry.gamesPlayed}g
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
