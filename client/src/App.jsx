import { useEffect } from 'react'
import { useAuthStore, useGameStore } from './store'
import { useSocket } from './hooks/useSocket'
import HomePage from './pages/HomePage'
import GamePage from './pages/GamePage'
import ResultPage from './pages/ResultPage'
import AuthPage from './pages/AuthPage'
import { Toaster } from 'react-hot-toast'

export default function App() {
  const { initAuth, user } = useAuthStore()
  const { phase } = useGameStore()

  useEffect(() => { 
    initAuth()
  }, [])

  // Only initialize socket when user is logged in
  useSocket()

  if (!user) return <AuthPage />

  return (
    <div className="app">
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#12121a', color: '#e8e8f0', border: '1px solid #2a2a40' },
          success: { iconTheme: { primary: '#00ff88', secondary: '#000' } },
          error: { iconTheme: { primary: '#ff3366', secondary: '#fff' } }
        }}
      />
      {phase === 'home' && <HomePage />}
      {phase === 'game' && <GamePage />}
      {phase === 'result' && <ResultPage />}
      {!phase && <HomePage />}
    </div>
  )
}
