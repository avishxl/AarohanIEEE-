import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, Stars, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import axios from 'axios'
import toast from 'react-hot-toast'
import LiveLeaderboard from '../components/Leaderboard/LiveLeaderboard'
import { useAuthStore, useGameStore } from '../store'

// ── 3D Animated Globe ─────────────────────────────────────────
function ThreatGlobe() {
  const meshRef = useRef()
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })
  return (
    <group>
      <Stars radius={80} depth={60} count={3000} factor={3} saturation={0} fade speed={1} />
      <mesh ref={meshRef}>
        <Sphere args={[2, 64, 64]}>
          <MeshDistortMaterial
            color="#0a1628"
            wireframe={false}
            distort={0.2}
            speed={1.5}
            roughness={0.8}
            emissive="#0044ff"
            emissiveIntensity={0.15}
          />
        </Sphere>
      </mesh>
      {/* Wireframe overlay */}
      <mesh>
        <Sphere args={[2.02, 32, 32]}>
          <meshBasicMaterial color="#1a4aff" wireframe opacity={0.15} transparent />
        </Sphere>
      </mesh>
      {/* Attack nodes */}
      {[...Array(12)].map((_, i) => {
        const phi = Math.acos(-1 + (2 * i) / 12)
        const theta = Math.sqrt(12 * Math.PI) * phi
        const x = 2.1 * Math.sin(phi) * Math.cos(theta)
        const y = 2.1 * Math.sin(phi) * Math.sin(theta)
        const z = 2.1 * Math.cos(phi)
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color={i % 3 === 0 ? '#ff3366' : i % 3 === 1 ? '#00ff88' : '#4488ff'} />
          </mesh>
        )
      })}
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#4488ff" />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#ff3366" />
    </group>
  )
}

// ── Attack Mode Cards ─────────────────────────────────────────
const MODES = [
  { id: 'phishing',   label: 'Phishing Emails',    icon: '📧', color: '#ff3366', difficulty: 'Medium', desc: 'Detect malicious emails trying to steal credentials' },
  { id: 'popup',      label: 'Fake Pop-ups',        icon: '⚠️', color: '#ffd700', difficulty: 'Easy',   desc: 'Identify scareware and browser fraud alerts' },
  { id: 'url',        label: 'URL Spoofing',        icon: '🔗', color: '#4488ff', difficulty: 'Hard',   desc: 'Spot lookalike domains and malicious links' },
  { id: 'password',   label: 'Password Safety',     icon: '🔐', color: '#00ff88', difficulty: 'Easy',   desc: 'Judge password strength and safe practices' },
  { id: 'fakelogin',  label: 'Fake Login Pages',    icon: '🖥️', color: '#ff8844', difficulty: 'Hard',   desc: 'Identify credential-harvesting fake login clones' },
  { id: 'social',     label: 'Social Engineering',  icon: '🎭', color: '#aa44ff', difficulty: 'Medium', desc: 'Detect manipulation via WhatsApp, calls, SMS' },
  { id: 'ransomware', label: 'Ransomware',          icon: '💣', color: '#ff6644', difficulty: 'Hard',   desc: 'Handle ransomware attacks and prevention' },
  { id: 'qrcode',     label: 'QR Code Attacks',     icon: '📱', color: '#44ffcc', difficulty: 'Medium', desc: 'Identify malicious QR codes and UPI scams' },
  { id: 'vishing',    label: 'Vishing Calls',       icon: '📞', color: '#ff44aa', difficulty: 'Hard',   desc: 'Spot voice phishing and phone scams' },
  { id: 'insider',    label: 'Insider Threats',     icon: '🏢', color: '#ffaa00', difficulty: 'Medium', desc: 'Recognize insider threat behaviors' },
  { id: 'wifi',       label: 'Wi-Fi Honeypots',     icon: '📡', color: '#00aaff', difficulty: 'Hard',   desc: 'Detect malicious networks and Evil Twin attacks' },
  { id: 'mixed',      label: 'MIXED MODE',          icon: '⚡', color: '#ffffff', difficulty: 'Varies', desc: 'Random questions from ALL 11 attack categories' },
]

const DIFFICULTY_COLORS = { Easy: '#00ff88', Medium: '#ffd700', Hard: '#ff3366', Varies: '#aaaaff' }

export default function HomePage() {
  const { user, logout } = useAuthStore()
  const { setMode, setDifficulty, startGame, leaderboard, onlineUsers, liveActivity, mode, difficulty } = useGameStore()
  const [selectedMode, setSelectedMode] = useState('mixed')
  const [selectedDiff, setSelectedDiff] = useState('all')
  const [isLoading, setIsLoading] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [userRank, setUserRank] = useState(null)

  useEffect(() => {
    axios.get('/api/leaderboard/me').then(r => setUserRank(r.data)).catch(() => {})
  }, [])

  const handleStartGame = async () => {
    setIsLoading(true)
    try {
      const res = await axios.get(`/api/game/questions/${selectedMode}`, {
        params: { difficulty: selectedDiff, count: 10, ai: 'true' }
      })
      startGame(res.data.questions, res.data.sessionId)
      toast.success(`Starting ${selectedMode.toUpperCase()} — Good luck!`)
    } catch (err) {
      toast.error('Failed to load questions. Check your connection.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#e8e8f0', fontFamily: "'Syne', sans-serif", overflow: 'hidden' }}>

      {/* Top Nav */}
      <motion.nav initial={{ y: -60 }} animate={{ y: 0 }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px', borderBottom: '1px solid #1a1a2e', background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24 }}>🛡️</span>
          <span style={{ fontWeight: 800, fontSize: 20, background: 'linear-gradient(135deg, #00ff88, #4488ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CyberShield</span>
          <span style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)', borderRadius: 4, padding: '2px 8px', fontSize: 10, color: '#00ff88', fontFamily: 'monospace', letterSpacing: 2 }}>v2.0</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 12, color: '#666', fontFamily: 'monospace' }}>
            <span style={{ color: '#00ff88' }}>●</span> {onlineUsers} online
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#12121a', border: '1px solid #2a2a40', borderRadius: 8, padding: '8px 16px' }}>
            <span style={{ fontSize: 14 }}>👤</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{user.username}</div>
              <div style={{ fontSize: 10, color: '#00ff88', fontFamily: 'monospace' }}>{user.rank || '🥉 Rookie'}</div>
            </div>
          </div>
          <button onClick={logout} style={{ background: 'transparent', border: '1px solid #2a2a40', borderRadius: 6, padding: '8px 16px', color: '#666', cursor: 'pointer', fontSize: 13 }}>Logout</button>
        </div>
      </motion.nav>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 0, maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>

        {/* LEFT — Main Content */}
        <div style={{ padding: '32px 24px 32px 0' }}>

          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', gap: 40, alignItems: 'center', marginBottom: 40 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#00ff88', letterSpacing: 3, marginBottom: 12, textTransform: 'uppercase' }}>⚡ Cybersecurity Training Platform</div>
              <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 16, background: 'linear-gradient(135deg, #fff 0%, #00ff88 60%, #4488ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Can You Survive<br/>A Cyber Attack?
              </h1>
              <p style={{ fontSize: 15, color: '#6666aa', lineHeight: 1.7, marginBottom: 24, maxWidth: 500 }}>
                Train against <strong style={{ color: '#e8e8f0' }}>10 real-world attack categories</strong> with AI-generated scenarios that never repeat. Beat your streak, climb the leaderboard.
              </p>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {[['🎯', user.totalScore || 0, 'Total Score'], ['🏆', user.bestScore || 0, 'Best Score'], ['🎮', user.gamesPlayed || 0, 'Games'], ['🔥', user.bestStreak || 0, 'Best Streak']].map(([icon, val, label]) => (
                  <div key={label} style={{ background: '#12121a', border: '1px solid #2a2a40', borderRadius: 10, padding: '14px 20px', textAlign: 'center' }}>
                    <div style={{ fontSize: 22 }}>{icon}</div>
                    <div style={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 700, color: '#00ff88' }}>{val.toLocaleString()}</div>
                    <div style={{ fontSize: 10, color: '#6666aa', textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ width: 260, height: 260, flexShrink: 0 }}>
              <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ThreatGlobe />
                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
              </Canvas>
            </div>
          </motion.div>

          {/* Mode Selection */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, fontFamily: 'monospace', color: '#6666aa', letterSpacing: 2, textTransform: 'uppercase' }}>Select Attack Category</h2>
              <div style={{ display: 'flex', gap: 8 }}>
                {['all', 'easy', 'medium', 'hard'].map(d => (
                  <button key={d} onClick={() => setSelectedDiff(d)}
                    style={{ padding: '4px 12px', borderRadius: 4, border: selectedDiff === d ? `1px solid ${DIFFICULTY_COLORS[d] || '#4488ff'}` : '1px solid #2a2a40', background: selectedDiff === d ? 'rgba(68,136,255,0.1)' : 'transparent', color: selectedDiff === d ? (DIFFICULTY_COLORS[d] || '#4488ff') : '#6666aa', fontSize: 11, fontFamily: 'monospace', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 1 }}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
              {MODES.map((m, i) => (
                <motion.div key={m.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}
                  onClick={() => setSelectedMode(m.id)}
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    background: selectedMode === m.id ? `rgba(${m.color === '#ffffff' ? '255,255,255' : m.color.slice(1).match(/../g).map(x => parseInt(x, 16)).join(',')},0.08)` : '#12121a',
                    border: selectedMode === m.id ? `1.5px solid ${m.color}` : '1px solid #2a2a40',
                    borderRadius: 10, padding: '14px 12px', cursor: 'pointer',
                    boxShadow: selectedMode === m.id ? `0 0 20px ${m.color}33` : 'none',
                    transition: 'all 0.2s'
                  }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{m.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>{m.label}</div>
                  <div style={{ fontSize: 10, color: '#6666aa', marginBottom: 8, lineHeight: 1.4 }}>{m.desc}</div>
                  <span style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 700, padding: '2px 8px', borderRadius: 3, background: `${DIFFICULTY_COLORS[m.difficulty]}22`, color: DIFFICULTY_COLORS[m.difficulty], textTransform: 'uppercase', letterSpacing: 1 }}>{m.difficulty}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <motion.button onClick={handleStartGame} disabled={isLoading}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            style={{ width: '100%', padding: '18px', background: 'linear-gradient(135deg, #00ff88, #00cc66)', color: '#000', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 800, fontFamily: "'Syne', sans-serif", cursor: 'pointer', letterSpacing: 1, textTransform: 'uppercase', boxShadow: '0 0 30px rgba(0,255,136,0.4)', opacity: isLoading ? 0.7 : 1 }}>
            {isLoading ? '⏳ Loading Scenarios...' : `▶  Launch ${MODES.find(m => m.id === selectedMode)?.label} Training`}
          </motion.button>
        </div>

        {/* RIGHT — Live Leaderboard */}
        <div style={{ padding: '32px 0 32px 24px', borderLeft: '1px solid #1a1a2e' }}>
          <LiveLeaderboard />
        </div>
      </div>
    </div>
  )
}
