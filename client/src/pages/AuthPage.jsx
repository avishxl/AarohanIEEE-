import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const { login, register, isLoading, error } = useAuthStore()

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!form.email || !form.password) {
      toast.error('Email and password required')
      return
    }
    
    if (!isLogin && !form.username) {
      toast.error('Username required')
      return
    }

    let success
    if (isLogin) {
      success = await login(form.email, form.password)
    } else {
      success = await register(form.username, form.email, form.password)
    }

    if (success) {
      toast.success(isLogin ? 'Login successful! 🎮' : 'Registration successful! 🚀')
      setForm({ username: '', email: '', password: '' })
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px', background: '#1a1a28', border: '1px solid #2a2a40',
    borderRadius: 8, color: '#e8e8f0', fontSize: 14, fontFamily: "'Syne', sans-serif",
    outline: 'none', boxSizing: 'border-box'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne', sans-serif", padding: 20 }}>
      {/* Background grid */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(68,136,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(68,136,255,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: '#12121a', border: '1px solid #2a2a40', borderRadius: 20, padding: '40px 36px', width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🛡️</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, background: 'linear-gradient(135deg, #00ff88, #4488ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 8 }}>CyberShield</h1>
          <p style={{ fontSize: 13, color: '#6666aa' }}>Gamified Cybersecurity Training Platform</p>
        </div>

        {/* Toggle */}
        <div style={{ display: 'flex', background: '#0a0a0f', borderRadius: 8, padding: 4, marginBottom: 24, border: '1px solid #2a2a40' }}>
          {['Login', 'Register'].map((tab, i) => (
            <button key={tab} onClick={() => setIsLogin(i === 0)}
              style={{ flex: 1, padding: '9px', borderRadius: 6, border: 'none', background: (isLogin ? i === 0 : i === 1) ? '#1a1a28' : 'transparent', color: (isLogin ? i === 0 : i === 1) ? '#00ff88' : '#6666aa', fontSize: 14, fontWeight: 700, fontFamily: "'Syne', sans-serif", cursor: 'pointer', transition: 'all 0.2s' }}>
              {tab}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {!isLogin && (
              <div>
                <label style={{ fontSize: 12, color: '#6666aa', fontFamily: 'monospace', letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Username</label>
                <input style={inputStyle} placeholder="CyberDefender" value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value }))} required />
              </div>
            )}
            <div>
              <label style={{ fontSize: 12, color: '#6666aa', fontFamily: 'monospace', letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Email</label>
              <input style={inputStyle} type="email" placeholder="agent@cybershield.com" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#6666aa', fontFamily: 'monospace', letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Password</label>
              <input style={inputStyle} type="password" placeholder="••••••••" value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
            </div>
          </div>

          {error && (
            <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(255,51,102,0.1)', border: '1px solid rgba(255,51,102,0.3)', borderRadius: 8, fontSize: 13, color: '#ff3366' }}>{error}</div>
          )}

          <motion.button type="submit" disabled={isLoading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            style={{ width: '100%', marginTop: 20, padding: '14px', background: 'linear-gradient(135deg, #00ff88, #00cc66)', color: '#000', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 800, fontFamily: "'Syne', sans-serif", cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 1, opacity: isLoading ? 0.7 : 1 }}>
            {isLoading ? '⏳ Please wait...' : isLogin ? '▶ Enter CyberShield' : '🚀 Create Account'}
          </motion.button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#4444aa' }}>
          91% of cyberattacks start with phishing. Are you prepared?
        </div>
      </motion.div>
    </div>
  )
}
