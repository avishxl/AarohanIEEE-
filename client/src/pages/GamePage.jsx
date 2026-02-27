import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useGameStore } from '../store'
import { useSocket } from '../hooks/useSocket'

const TIMER_SECONDS = 30

// ── Scenario Renderers ─────────────────────────────────────────
function EmailScenario({ data }) {
  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #2a2a40' }}>
      <div style={{ background: '#1a1a28', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #2a2a40' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['#ff5f57','#febc2e','#28c840'].map(c => <span key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c, display: 'block' }} />)}
        </div>
        <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#6666aa', marginLeft: 'auto' }}>📧 INBOX</span>
      </div>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #2a2a40' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: '6px 12px', fontSize: 12, marginBottom: 12 }}>
          <span style={{ color: '#6666aa', fontFamily: 'monospace' }}>FROM:</span>
          <span style={{ color: data.answer === 'threat' ? '#ff3366' : '#e8e8f0' }}>{data.from}</span>
          {data.to && <><span style={{ color: '#6666aa', fontFamily: 'monospace' }}>TO:</span><span>{data.to}</span></>}
        </div>
        <div style={{ fontSize: 17, fontWeight: 700 }}>{data.subject}</div>
        {data.hasAttachment && (
          <div style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,100,68,0.1)', border: '1px solid rgba(255,100,68,0.3)', borderRadius: 6, padding: '4px 10px', fontSize: 12, color: '#ff6444' }}>
            📎 {data.attachmentName || 'attachment'}
          </div>
        )}
      </div>
      <div style={{ padding: '16px 20px', fontSize: 14, lineHeight: 1.8, color: '#ccccdd' }}
        dangerouslySetInnerHTML={{ __html: (data.body || '').replace(/\n/g, '<br/>') }} />
    </div>
  )
}

function PopupScenario({ data }) {
  return (
    <div style={{ background: '#111', borderRadius: 12, padding: 32, textAlign: 'center' }}>
      <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#0d2137)', border: '2px solid #4488ff', borderRadius: 14, padding: 28, maxWidth: 420, margin: '0 auto', boxShadow: '0 0 40px rgba(68,136,255,0.25)', position: 'relative' }}>
        <span style={{ position: 'absolute', top: 12, right: 16, color: '#555', fontSize: 16, cursor: 'default' }}>✕</span>
        <div style={{ fontSize: 44, marginBottom: 14 }}>{data.icon}</div>
        <div style={{ fontSize: 17, fontWeight: 800, color: '#ffd700', marginBottom: 10 }}>{data.title}</div>
        <div style={{ fontSize: 13, color: '#9999bb', lineHeight: 1.7, marginBottom: 20 }}>{data.body}</div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          {(data.buttons || []).map((btn, i) => (
            <button key={i} style={{ padding: '9px 20px', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'default', border: 'none', background: i === 0 ? '#4488ff' : '#1a1a28', color: i === 0 ? '#fff' : '#aaa' }}>{btn}</button>
          ))}
        </div>
        {data.source && <div style={{ fontSize: 10, color: '#555', marginTop: 12, fontFamily: 'monospace' }}>Context: {data.source}</div>}
      </div>
    </div>
  )
}

function UrlScenario({ data }) {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#1a1a28', border: '1px solid #2a2a40', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontFamily: 'monospace', fontSize: 13 }}>
        <span>{data.lock ? '🔒' : '🔓'}</span>
        <span style={{ flex: 1, wordBreak: 'break-all', color: '#e8e8f0' }}>{data.url}</span>
      </div>
      <div style={{ fontSize: 14, color: '#aaaacc', lineHeight: 1.7, background: '#12121a', borderRadius: 8, padding: '12px 16px' }}>{data.context}</div>
      {data.protocol === 'http' && (
        <div style={{ marginTop: 10, fontSize: 12, color: '#ff6444', fontFamily: 'monospace' }}>⚠️ No HTTPS — connection is unencrypted</div>
      )}
    </div>
  )
}

function PasswordScenario({ data, onOptionSelect, selectedOption, isAnswered }) {
  const strengthBar = (pw) => {
    let s = 0
    if (pw.length >= 12) s++
    if (pw.length >= 16) s++
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++
    if (/[0-9]/.test(pw) && /[^a-zA-Z0-9]/.test(pw)) s++
    if (['password','1234','qwerty','admin'].some(w => pw.toLowerCase().includes(w))) s = Math.max(0, s - 2)
    return Math.min(4, Math.max(1, s))
  }
  const sColor = ['','#ff3366','#ff6444','#ffd700','#00ff88']

  return (
    <div style={{ padding: 24 }}>
      <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#6666aa', marginBottom: 16, letterSpacing: 2, textTransform: 'uppercase' }}>{data.question}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {(data.options || []).map((opt, i) => {
          const strength = strengthBar(opt.pw)
          const isSelected = selectedOption === `option${i + 1}`
          return (
            <button key={i} onClick={() => !isAnswered && onOptionSelect(`option${i + 1}`)}
              disabled={isAnswered}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: isSelected ? 'rgba(68,136,255,0.1)' : '#1a1a28', border: isSelected ? '1.5px solid #4488ff' : '1px solid #2a2a40', borderRadius: 10, cursor: isAnswered ? 'default' : 'pointer', transition: 'all 0.2s', textAlign: 'left' }}>
              <div>
                <span style={{ fontFamily: 'monospace', fontSize: 15, color: '#e8e8f0', marginRight: 12 }}>{i + 1}.</span>
                <span style={{ fontFamily: 'monospace', fontSize: 15, fontWeight: 700 }}>{opt.pw}</span>
                {opt.hint && <div style={{ fontSize: 11, color: '#6666aa', marginTop: 4, marginLeft: 24 }}>{opt.hint}</div>}
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {[1,2,3,4].map(s => (
                  <div key={s} style={{ width: 18, height: 4, borderRadius: 2, background: s <= strength ? sColor[strength] : '#2a2a40' }} />
                ))}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function MessageScenario({ data }) {
  const channelColors = { WhatsApp: '#25D366', SMS: '#4488ff', LinkedIn: '#0A66C2', Phone: '#ffd700' }
  const color = channelColors[data.channel] || '#6666aa'
  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{ background: `${color}22`, border: `1px solid ${color}44`, borderRadius: 6, padding: '4px 12px', fontSize: 12, fontWeight: 700, color }}>
          {data.channel}
        </div>
        <span style={{ fontSize: 13, color: '#6666aa' }}>From: {data.from}</span>
      </div>
      <div style={{ background: '#1a1a28', borderRadius: 12, padding: 16, borderLeft: `3px solid ${color}`, fontSize: 14, lineHeight: 1.8, color: '#ccccdd', marginBottom: 12 }}>
        {data.message}
      </div>
      {data.context && (
        <div style={{ fontSize: 12, color: '#6666aa', fontStyle: 'italic', padding: '8px 12px', background: '#12121a', borderRadius: 6 }}>📌 {data.context}</div>
      )}
    </div>
  )
}

function RansomwareScenario({ data }) {
  return (
    <div style={{ padding: 24 }}>
      {data.type === 'screen' || data.type === 'screen' ? (
        <div style={{ background: '#0d0d0d', border: '2px solid #ff3366', borderRadius: 10, padding: 28, textAlign: 'center', boxShadow: '0 0 40px rgba(255,51,102,0.2)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#ff3366', marginBottom: 12 }}>{data.title}</div>
          <div style={{ fontSize: 13, color: '#aaaacc', lineHeight: 1.8, marginBottom: 16 }}>{data.body}</div>
          <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#ff6444', padding: '8px 12px', background: 'rgba(255,51,102,0.05)', borderRadius: 6 }}>Source: {data.source}</div>
        </div>
      ) : (
        <div style={{ background: '#12121a', border: '1px solid #2a2a40', borderRadius: 10, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#ffd700', marginBottom: 12 }}>{data.question}</div>
          <div style={{ fontSize: 13, color: '#aaaacc' }}>{data.body}</div>
        </div>
      )}
    </div>
  )
}

function QRScenario({ data }) {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ background: '#1a1a28', borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: '#aaaacc', lineHeight: 1.8, marginBottom: 12 }}>{data.description}</div>
        {data.previewUrl && (
          <div style={{ fontFamily: 'monospace', fontSize: 12, padding: '10px 14px', background: '#0d0d1a', borderRadius: 8, color: '#e8e8f0', wordBreak: 'break-all' }}>🔗 {data.previewUrl}</div>
        )}
      </div>
      {data.context && (
        <div style={{ fontSize: 12, color: '#6666aa', fontStyle: 'italic', padding: '8px 12px', background: '#12121a', borderRadius: 6 }}>📌 {data.context}</div>
      )}
    </div>
  )
}

function FakeLoginScenario({ data }) {
  const isHttps = data.url?.startsWith('https')
  return (
    <div style={{ padding: 24 }}>
      {/* Browser chrome mockup */}
      <div style={{ background: '#1a1a28', borderRadius: '12px 12px 0 0', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid #2a2a40' }}>
        <div style={{ display: 'flex', gap: 5 }}>
          {['#ff5f57','#febc2e','#28c840'].map(c => <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, display: 'block' }}/>)}
        </div>
        <div style={{ flex: 1, background: '#12121a', borderRadius: 5, padding: '5px 12px', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'monospace', fontSize: 12 }}>
          <span>{isHttps ? '🔒' : '🔓'}</span>
          <span style={{ color: '#e8e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{data.url}</span>
        </div>
      </div>
      {/* Login page content */}
      <div style={{ background: '#fff', borderRadius: '0 0 12px 12px', padding: '28px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>{data.favicon}</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#111', marginBottom: 20 }}>{data.logo}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 300, margin: '0 auto', textAlign: 'left' }}>
          {(data.fields || []).map((field, i) => (
            <div key={i}>
              <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 4 }}>{field}</label>
              <div style={{ height: 36, background: '#f5f5f5', border: '1px solid #ddd', borderRadius: 5 }}/>
            </div>
          ))}
          <div style={{ height: 38, background: '#1a73e8', borderRadius: 5, marginTop: 8 }}/>
        </div>
        {data.extraNote && <div style={{ fontSize: 11, color: '#888', marginTop: 14 }}>{data.extraNote}</div>}
      </div>
      {data.context && (
        <div style={{ marginTop: 10, fontSize: 12, color: '#6666aa', fontStyle: 'italic', padding: '8px 12px', background: '#12121a', borderRadius: 6 }}>📌 {data.context}</div>
      )}
    </div>
  )
}

function WifiScenario({ data }) {
  const signalBars = (s) => s?.split('').filter(c => c === '●').length || 3
  return (
    <div style={{ padding: 24 }}>
      {data.networks ? (
        <>
          <div style={{ fontSize: 13, color: '#aaaacc', marginBottom: 16 }}>{data.context}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.networks.map((n, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: '#1a1a28', borderRadius: 10, border: '1px solid #2a2a40' }}>
                <span style={{ fontSize: 20 }}>📡</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 700 }}>{n.ssid}</div>
                  <div style={{ fontSize: 11, color: '#6666aa' }}>{n.security} {n.note && `— ${n.note}`}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: n.security === 'Open' ? '#ff3366' : '#00ff88', fontFamily: 'monospace' }}>{n.security}</div>
                  <div style={{ fontSize: 11, color: '#6666aa' }}>{n.signal}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ fontSize: 14, color: '#aaaacc', lineHeight: 1.8 }}>{data.situation || data.description}</div>
      )}
    </div>
  )
}

// ── Choice Buttons ─────────────────────────────────────────────
const CHOICE_OPTIONS = {
  default: [
    { val: 'safe',   label: '✅  Safe',   color: '#00ff88' },
    { val: 'threat', label: '🚨  Threat', color: '#ff3366' }
  ],
  ransomware: [
    { val: 'option1', label: 'A', color: '#4488ff' },
    { val: 'option2', label: 'B', color: '#4488ff' },
    { val: 'option3', label: 'C', color: '#4488ff' },
    { val: 'option4', label: 'D', color: '#4488ff' },
  ],
  wifi_option: [
    { val: 'option1', label: 'Network 1', color: '#4488ff' },
    { val: 'option2', label: 'Network 2', color: '#4488ff' },
    { val: 'option3', label: 'Network 3', color: '#4488ff' },
    { val: 'threat',  label: '⚠️  This is an attack', color: '#ff3366' },
    { val: 'safe',    label: '✅  This is safe', color: '#00ff88' },
  ]
}

function renderScenario(scenario, onOptionSelect, selectedOption, isAnswered) {
  if (!scenario) return null
  const type = scenario.type
  if (type === 'email') return <EmailScenario data={scenario} />
  if (type === 'popup') return <PopupScenario data={scenario} />
  if (type === 'url') return <UrlScenario data={scenario} />
  if (type === 'password_rank') return <PasswordScenario data={scenario} onOptionSelect={onOptionSelect} selectedOption={selectedOption} isAnswered={isAnswered} />
  if (type === 'message' || type === 'phone_call' || type === 'call_script') return <MessageScenario data={scenario} />
  if (type === 'screen' || type === 'prevention') return <RansomwareScenario data={scenario} />
  if (type === 'qr') return <QRScenario data={scenario} />
  if (type === 'fakelogin') return <FakeLoginScenario data={scenario} />
  if (type === 'wifi' || type === 'wifi_captive' || type === 'wifi_security') return <WifiScenario data={scenario} />
  if (type === 'workplace') return <MessageScenario data={{ channel: 'Workplace', from: 'Situation', message: scenario.situation, context: scenario.context }} />
  // Fallback
  return <div style={{ padding: 24, color: '#aaa', fontSize: 14 }}>{JSON.stringify(scenario, null, 2)}</div>
}

// ── Main GamePage ──────────────────────────────────────────────
export default function GamePage() {
  const { questions, currentIndex, score, lives, streak, bestStreak, isAnswered, lastResult, submitAnswer, nextQuestion, goHome } = useGameStore()
  const { emitAnswer } = useSocket()

  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS)
  const [selectedOption, setSelectedOption] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [shakeScreen, setShakeScreen] = useState(false)
  const timerRef = useRef(null)

  const question = questions[currentIndex]
  const total = questions.length
  const progress = ((currentIndex) / total) * 100

  // Reset timer on new question
  useEffect(() => {
    setTimeLeft(TIMER_SECONDS)
    setSelectedOption(null)
    if (timerRef.current) clearInterval(timerRef.current)
    if (!isAnswered) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current)
            handleAnswer('timeout')
            return 0
          }
          return t - 1
        })
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [currentIndex, isAnswered])

  const handleAnswer = useCallback(async (chosen) => {
    if (isAnswered || isSubmitting) return
    if (chosen === 'timeout') chosen = 'safe' // default wrong on timeout

    clearInterval(timerRef.current)
    setIsSubmitting(true)
    setSelectedOption(chosen)

    try {
      const timeTaken = TIMER_SECONDS - timeLeft
      const res = await axios.post('/api/game/answer', {
        questionId: question?.id,
        answer: chosen,
        category: question?.category,
        timeTaken
      })

      submitAnswer(res.data)
      emitAnswer(res.data.correct, streak + (res.data.correct ? 1 : 0))

      if (!res.data.correct) {
        setShakeScreen(true)
        setTimeout(() => setShakeScreen(false), 600)
      }
    } catch (err) {
      toast.error('Connection error')
    } finally {
      setIsSubmitting(false)
    }
  }, [isAnswered, isSubmitting, question, timeLeft, streak])

  if (!question) return null

  const scenario = question.scenario
  const needsMultiChoice = scenario?.type === 'password_rank' || scenario?.options
  const isRansomwareMulti = (scenario?.type === 'prevention' || scenario?.type === 'screen') && scenario?.options

  const timerColor = timeLeft > 15 ? '#00ff88' : timeLeft > 7 ? '#ffd700' : '#ff3366'
  const categoryIcons = { phishing:'📧', popup:'⚠️', url:'🔗', password:'🔐', social:'🎭', ransomware:'💣', qrcode:'📱', vishing:'📞', insider:'🏢', wifi:'📡' }

  return (
    <motion.div animate={{ x: shakeScreen ? [-8, 8, -6, 6, -4, 4, 0] : 0 }} transition={{ duration: 0.5 }}
      style={{ minHeight: '100vh', background: '#0a0a0f', color: '#e8e8f0', fontFamily: "'Syne', sans-serif", padding: 0 }}>

      {/* HUD Bar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #1a1a2e', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <button onClick={goHome} style={{ background: 'transparent', border: '1px solid #2a2a40', borderRadius: 6, padding: '6px 12px', color: '#6666aa', cursor: 'pointer', fontSize: 12 }}>← Exit</button>
        <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#6666aa', textTransform: 'uppercase', letterSpacing: 2 }}>{categoryIcons[question.category] || '🎯'} {question.category}</span>
        <div style={{ flex: 1 }} />
        {[
          { label: 'SCORE', val: score.toLocaleString(), color: '#00ff88' },
          { label: 'LIVES', val: '❤️'.repeat(lives) + '🖤'.repeat(Math.max(0, 3 - lives)), color: '#ff3366' },
          { label: 'STREAK', val: `🔥 ${streak}`, color: '#ffd700' },
          { label: `Q`, val: `${currentIndex + 1}/${total}`, color: '#e8e8f0' }
        ].map(({ label, val, color }) => (
          <div key={label} style={{ background: '#12121a', border: '1px solid #2a2a40', borderRadius: 6, padding: '6px 14px', display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 10, color: '#6666aa', fontFamily: 'monospace' }}>{label}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color, fontFamily: 'monospace' }}>{val}</span>
          </div>
        ))}

        {/* Timer */}
        <motion.div animate={{ scale: timeLeft <= 5 ? [1, 1.1, 1] : 1 }} transition={{ repeat: Infinity, duration: 0.5 }}
          style={{ background: `${timerColor}15`, border: `1.5px solid ${timerColor}`, borderRadius: 8, padding: '6px 16px', fontFamily: 'monospace', fontSize: 16, fontWeight: 700, color: timerColor, minWidth: 56, textAlign: 'center' }}>
          {timeLeft}s
        </motion.div>
      </div>

      {/* Progress Bar */}
      <div style={{ height: 4, background: '#1a1a2e' }}>
        <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }}
          style={{ height: '100%', background: 'linear-gradient(90deg, #00ff88, #4488ff)', borderRadius: 2 }} />
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '24px 20px' }}>

        {/* Question Label */}
        <motion.div key={currentIndex} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#6666aa', letterSpacing: 3, textTransform: 'uppercase' }}>
            {scenario?.type === 'password_rank' ? scenario.question : 'Classify this scenario — Safe or Threat?'}
          </span>
          {question.isAIGenerated && (
            <span style={{ fontFamily: 'monospace', fontSize: 9, background: 'rgba(170,68,255,0.1)', border: '1px solid rgba(170,68,255,0.3)', color: '#aa44ff', borderRadius: 4, padding: '2px 8px', letterSpacing: 1 }}>✨ AI GENERATED</span>
          )}
          <span style={{ fontFamily: 'monospace', fontSize: 9, background: question.difficulty === 'hard' ? 'rgba(255,51,102,0.1)' : question.difficulty === 'medium' ? 'rgba(255,215,0,0.1)' : 'rgba(0,255,136,0.1)', border: `1px solid ${question.difficulty === 'hard' ? '#ff3366' : question.difficulty === 'medium' ? '#ffd700' : '#00ff88'}44`, color: question.difficulty === 'hard' ? '#ff3366' : question.difficulty === 'medium' ? '#ffd700' : '#00ff88', borderRadius: 4, padding: '2px 8px', letterSpacing: 1, textTransform: 'uppercase' }}>{question.difficulty}</span>
        </motion.div>

        {/* Scenario Card */}
        <AnimatePresence mode="wait">
          <motion.div key={`scenario-${currentIndex}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}
            style={{ background: '#12121a', border: '1px solid #2a2a40', borderRadius: 16, overflow: 'hidden', marginBottom: 20, boxShadow: '0 8px 40px rgba(0,0,0,0.4)' }}>
            {renderScenario(scenario, handleAnswer, selectedOption, isAnswered)}
          </motion.div>
        </AnimatePresence>

        {/* Choice Buttons */}
        {!needsMultiChoice && (
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
            {[
              { val: 'safe',   label: '✅  This is SAFE',   color: '#00ff88', glow: '0 0 20px rgba(0,255,136,0.4)' },
              { val: 'threat', label: '🚨  This is a THREAT', color: '#ff3366', glow: '0 0 20px rgba(255,51,102,0.4)' }
            ].map(btn => {
              const isSelected = selectedOption === btn.val
              const isCorrect = isAnswered && lastResult?.correctAnswer === btn.val
              const isWrong = isAnswered && isSelected && !lastResult?.correct
              return (
                <motion.button key={btn.val} onClick={() => handleAnswer(btn.val)} disabled={isAnswered || isSubmitting}
                  whileHover={!isAnswered ? { y: -3, scale: 1.02 } : {}} whileTap={!isAnswered ? { scale: 0.97 } : {}}
                  style={{ flex: 1, minWidth: 160, padding: '16px 20px', borderRadius: 12, border: isCorrect ? `2px solid ${btn.color}` : isWrong ? '2px solid #ff3366' : '1px solid #2a2a40', background: isCorrect ? `${btn.color}18` : isWrong ? 'rgba(255,51,102,0.1)' : '#12121a', color: isCorrect || (isSelected && !isAnswered) ? btn.color : '#e8e8f0', fontSize: 15, fontWeight: 800, fontFamily: "'Syne', sans-serif", cursor: isAnswered ? 'default' : 'pointer', boxShadow: isCorrect ? btn.glow : 'none', transition: 'all 0.2s' }}>
                  {btn.label}
                </motion.button>
              )
            })}
          </div>
        )}

        {/* Ransomware / Multi option choices */}
        {isRansomwareMulti && !needsMultiChoice && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {scenario.options.map((opt, i) => {
              const val = `option${i + 1}`
              const isSelected = selectedOption === val
              const isCorrect = isAnswered && lastResult?.correctAnswer === val
              const isWrong = isAnswered && isSelected && !lastResult?.correct
              return (
                <motion.button key={i} onClick={() => handleAnswer(val)} disabled={isAnswered}
                  whileHover={!isAnswered ? { x: 4 } : {}}
                  style={{ padding: '14px 18px', borderRadius: 10, border: isCorrect ? '2px solid #00ff88' : isWrong ? '2px solid #ff3366' : '1px solid #2a2a40', background: isCorrect ? 'rgba(0,255,136,0.08)' : isWrong ? 'rgba(255,51,102,0.08)' : '#12121a', color: '#e8e8f0', fontSize: 14, fontFamily: "'Syne', sans-serif", cursor: isAnswered ? 'default' : 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
                  <span style={{ fontFamily: 'monospace', color: '#6666aa', marginRight: 10 }}>{String.fromCharCode(65 + i)}.</span>
                  {opt.text}
                </motion.button>
              )
            })}
          </div>
        )}

        {/* Feedback Panel */}
        <AnimatePresence>
          {isAnswered && lastResult && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ background: '#12121a', borderRadius: 14, padding: '20px 24px', borderLeft: `4px solid ${lastResult.correct ? '#00ff88' : '#ff3366'}` }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: lastResult.correct ? '#00ff88' : '#ff3366', marginBottom: 10 }}>
                {lastResult.correct ? '✅ Correct! Well spotted.' : '❌ Incorrect. Here\'s what to look for:'}
              </div>
              <div style={{ fontSize: 13, color: '#aaaacc', lineHeight: 1.8, marginBottom: lastResult.redFlags?.length ? 12 : 0 }}>
                {lastResult.explanation}
              </div>
              {lastResult.redFlags?.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#ff3366', marginBottom: 8, letterSpacing: 2, textTransform: 'uppercase' }}>🚩 Red Flags:</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {lastResult.redFlags.map((flag, i) => (
                      <div key={i} style={{ fontSize: 12, color: '#ccccee', display: 'flex', gap: 8 }}>
                        <span style={{ color: '#ff3366' }}>→</span> {flag}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {lastResult.pointsEarned > 0 && (
                <div style={{ marginTop: 12, fontFamily: 'monospace', fontSize: 13, color: '#ffd700' }}>
                  +{lastResult.pointsEarned} pts {lastResult.timeBonus > 0 && <span style={{ color: '#00ff88' }}>(+{lastResult.timeBonus} speed bonus)</span>}
                  {streak >= 2 && <span style={{ color: '#ff6444' }}>  🔥 {streak}x STREAK!</span>}
                </div>
              )}
              <motion.button onClick={nextQuestion} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                style={{ marginTop: 16, background: '#00ff88', color: '#000', border: 'none', borderRadius: 8, padding: '12px 32px', fontSize: 14, fontWeight: 800, fontFamily: "'Syne', sans-serif", cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 1 }}>
                {currentIndex >= total - 1 || lives <= 1 ? 'See Results →' : 'Next Question →'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
