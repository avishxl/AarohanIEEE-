import { useEffect } from 'react'
import { io } from 'socket.io-client'
import { useGameStore, useAuthStore } from '../store'

let socket = null

export const useSocket = () => {
  const { user } = useAuthStore()
  const { addLiveActivity, setLeaderboard, setOnlineUsers } = useGameStore()

  useEffect(() => {
    if (!socket) {
      socket = io('http://localhost:5000', {
        transports: ['websocket'],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      })
    }

    const joinRoom = () => {
      if (user) socket.emit('user:join', { userId: user.id, username: user.username })
    }

    if (socket.connected) joinRoom()
    socket.on('connect', joinRoom)
    socket.on('leaderboard:update', (lb) => setLeaderboard(lb))
    socket.on('users:online', (n) => setOnlineUsers(n))
    socket.on('game:activity', (activity) => addLiveActivity(activity))

    return () => {
      socket.off('connect', joinRoom)
      socket.off('leaderboard:update')
      socket.off('users:online')
      socket.off('game:activity')
    }
  }, [user])

  return {
    emitScore:          (data)           => socket?.emit('game:score_update', data),
    emitGameStarted:    (mode)           => socket?.emit('game:started', { mode }),
    emitAnswer:         (correct, streak)=> socket?.emit('game:answered', { correct, streak }),
    requestLeaderboard: ()               => socket?.emit('leaderboard:request')
  }
}
