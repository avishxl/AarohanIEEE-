import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useGameStore, useAuthStore } from '../store'
import { useSocket } from '../hooks/useSocket'

const RANK_DATA = [
  { min: 0,    grade: 'D', title: 'High Risk User',      color: '#ff3366', icon: '🚨', msg: 'You are vulnerable to most attacks. Practice daily!' },
  { min: 30,   grade: 'C', title: 'Awareness Needed',    color: '#ff6444', icon: '⚠️',  msg: 'You caught some threats — but attackers would exploit the gaps.' },
  { min: 50,   grade: 'B', title: 'Defender',            color: '#4488ff', icon: '⚡',  msg: 'Good instincts! Keep sharpening your threat detection.' },
  { min: 70,   grade: 'A', title: 'Security Pro',        color: '#00ff88', icon: '🛡️', msg: 'Excellent threat awareness. You would spot most real attacks.' },
  { min: 90,   grade: 'A+', title: 'Cyber Expert',       color: '#ffd700', icon: '🏆', msg: 'Outstanding! You have elite-level cybersecurity awareness.' },
  { min: 100,  grade: 'S', title: 'Cyber Legend',        color: '#aa44ff', icon: '🌟', msg: 'Perfect score! You are among the top cyber defenders.' },
]

const CATEGORY_TIPS = {
  phishing:   'Always check sender domains carefully. Hover over links before clicking. Legitimate companies never demand "immediate action."',
  popup:      'Websites cannot detect viruses. Real browser updates come from the browser itself. "You won" pop-ups are always fake.',
  url:        'HTTPS only means encrypted — not safe. Read domains right-to-left from the TLD. Hyphens in domains are a red flag.',
  password:   'Use a password manager. Never reuse passwords. Enable 2FA everywhere. Length matters more than complexity.',
  social:     'Verify unexpected requests via a second channel. Government agencies never call asking for money. Never share OTPs.',
  ransomware: 'Follow the 3-2-1 backup rule. Never pay ransom. Disconnect infected machines immediately. .exe attachments are dangerous.',
  qrcode:     'Verify UPI recipient name before paying. You scan QR to SEND money, never to receive. Watch for stickers over original QR codes.',
  vishing:    'Banks never ask for PINs or CVVs by phone. Caller ID can be spoofed. Hang up and call official numbers directly.',
  insider:    'Never share credentials. Report suspicious data copying. Verify financial requests via a second channel.',
  wifi:       'Use VPN on public WiFi. Never connect to open networks for sensitive work. Use personal hotspot instead.'
}

export default function ResultPage() {
  const { score, correctCount, wrongCount, bestStreak, questions, mode, skillScores, goHome } = useGameStore()
  const { user, updateUser } = useAuthStore()
  const { emitScore } = useSocket()
  const [newBadges, setNewBadges] = useState([])
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const total = questions.length
  const answered = correctCount + wrongCount
  const accuracy = answered > 0 ? Math.round((correctCount / answered) * 100) : 0

  const rankInfo = [...RANK_DATA].reverse().find(r => accuracy >= r.min) || RANK_DATA[0]

  // Build radar data
  const radarData = Object.entries(skillScores).map(([cat, { correct, total: t }]) => ({
    category: cat.charAt(0).toUpperCase() + cat.slice(1),
    score: Math.round((correct / t) * 100),
    fullMark: 100
  }))

  // Per-category breakdown
  const weakCategories = Object.entries(skillScores)
    .filter(([, { correct, total: t }]) => correct / t < 0.6)
    .map(([cat]) => cat)

  useEffect(() => {
    if (!saved) saveResult()
  }, [])

  const saveResult = async () => {
    setIsSaving(true)
    try {
      // Convert skillScores to percentage per category
      const skillPcts = {}
      Object.entries(skillScores).forEach(([cat, { correct, total: t }]) => {
        skillPcts[cat] = Math.round((correct / t) * 100)
      })

      const res = await axios.post('/api/game/complete', {
        mode, score, correct: correctCount, total,
        accuracy, difficulty: 'all', bestStreak, skillScores: skillPcts
      })

      setNewBadges(res.data.newBadges || [])
      updateUser({ totalScore: res.data.totalScore, rank: res.data.rank, level: res.data.level, xp: res.data.xp })

      emitScore({ username: user.username, score, mode, accuracy })
      setSaved(true)

      if (res.data.newBadges?.length > 0) {
        res.data.newBadges.forEach(b => toast.success(`🏅 New Badge: ${b.name}!`))
      }
    } catch (err) {
      console.error('Save failed:', err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#e8e8f0', fontFamily: "'Syne', sans-serif", padding: '40px 20px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: 40 }}>
          {/* Grade Circle */}
          <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={140} height={140} style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
              <circle cx={70} cy={70} r={60} fill="none" stroke="#1a1a2e" strokeWidth={8} />
              <motion.circle cx={70} cy={70} r={60} fill="none" stroke={rankInfo.color} strokeWidth={8}
                strokeDasharray={`${2 * Math.PI * 60}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 60 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 60 * (1 - accuracy / 100) }}
                transition={{ duration: 1.5, ease: 'easeOut' }} />
            </svg>
            <div style={{ textAlign: 'center', zIndex: 1 }}>
              <div style={{ fontSize: 40, fontWeight: 800, color: rankInfo.color }}>{rankInfo.grade}</div>
              <div style={{ fontFamily: 'monospace', fontSize: 13, color: '#6666aa' }}>{accuracy}%</div>
            </div>
          </div>

          <div style={{ display: 'inline-block', background: `${rankInfo.color}15`, border: `1px solid ${rankInfo.color}44`, borderRadius: 6, padding: '5px 18px', fontFamily: 'monospace', fontSize: 12, color: rankInfo.color, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>
            {rankInfo.icon} {rankInfo.title}
          </div>
          <div style={{ fontSize: 13, color: '#6666aa', maxWidth: 400, margin: '0 auto' }}>{rankInfo.msg}</div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 28 }}>
          {[
            { label: 'Final Score', val: score.toLocaleString(), color: '#00ff88', icon: '🎯' },
            { label: 'Correct', val: `${correctCount}/${total}`, color: '#4488ff', icon: '✅' },
            { label: 'Accuracy', val: `${accuracy}%`, color: rankInfo.color, icon: '🎯' },
            { label: 'Best Streak', val: bestStreak, color: '#ffd700', icon: '🔥' },
          ].map(({ label, val, color, icon }) => (
            <div key={label} style={{ background: '#12121a', border: '1px solid #2a2a40', borderRadius: 12, padding: '18px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
              <div style={{ fontFamily: 'monospace', fontSize: 24, fontWeight: 700, color }}>{val}</div>
              <div style={{ fontSize: 10, color: '#6666aa', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </motion.div>

        {/* Radar Chart */}
        {radarData.length > 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            style={{ background: '#12121a', border: '1px solid #2a2a40', borderRadius: 14, padding: '20px 16px', marginBottom: 24 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#6666aa', letterSpacing: 2, marginBottom: 16, textTransform: 'uppercase' }}>📊 Skill Radar — Your Performance by Category</div>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                <PolarGrid stroke="#2a2a40" />
                <PolarAngleAxis dataKey="category" tick={{ fill: '#6666aa', fontSize: 11 }} />
                <Radar name="Score" dataKey="score" stroke="#00ff88" fill="#00ff88" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* New Badges */}
        {newBadges.length > 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
            style={{ background: 'rgba(170,68,255,0.05)', border: '1px solid rgba(170,68,255,0.3)', borderRadius: 14, padding: '18px 20px', marginBottom: 24 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#aa44ff', letterSpacing: 2, marginBottom: 12, textTransform: 'uppercase' }}>🏅 New Badges Earned!</div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {newBadges.map(b => (
                <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(170,68,255,0.1)', borderRadius: 8, padding: '8px 14px' }}>
                  <span style={{ fontSize: 20 }}>{b.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{b.name}</div>
                    <div style={{ fontSize: 11, color: '#6666aa' }}>{b.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Weak Areas */}
        {weakCategories.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            style={{ background: '#12121a', border: '1px solid #2a2a40', borderRadius: 14, padding: '18px 20px', marginBottom: 24 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#ff3366', letterSpacing: 2, marginBottom: 14, textTransform: 'uppercase' }}>💡 Focus Areas — Improve These</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {weakCategories.map(cat => (
                <div key={cat} style={{ display: 'flex', gap: 12, fontSize: 13, color: '#ccccee', lineHeight: 1.6 }}>
                  <span style={{ color: '#ff3366', flexShrink: 0 }}>→</span>
                  <div><strong style={{ color: '#e8e8f0', textTransform: 'capitalize' }}>{cat}:</strong> {CATEGORY_TIPS[cat]}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <motion.button onClick={() => { goHome() }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            style={{ flex: 1, minWidth: 160, padding: '15px', background: 'linear-gradient(135deg, #00ff88, #00cc66)', color: '#000', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 800, fontFamily: "'Syne', sans-serif", cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 1 }}>
            ▶ Play Again
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => { toast.success('Score copied! Share it with your team.'); navigator.clipboard?.writeText(`I scored ${score} pts (${accuracy}% accuracy) on CyberShield! 🛡️ Can you beat me?`) }}
            style={{ flex: 1, minWidth: 160, padding: '15px', background: 'transparent', color: '#e8e8f0', border: '1px solid #2a2a40', borderRadius: 10, fontSize: 15, fontWeight: 700, fontFamily: "'Syne', sans-serif", cursor: 'pointer' }}>
            📤 Share Score
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
