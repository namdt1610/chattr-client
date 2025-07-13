'use client'
import { useEffect, useState } from 'react'
import io, { Socket } from 'socket.io-client'
import { getSocketUrl } from '@/utils/apiConfig'

// We need to keep the parameter for API compatibility, but disable the ESLint warning
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useSocket = (currentUser: unknown) => {
    const [socket, setSocket] = useState<Socket | null>(null)
    const [onlineUsers, setOnlineUsers] = useState<string[]>([])
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        const token =
            typeof window !== 'undefined'
                ? localStorage.getItem('accessToken')
                : null

        console.log(
            'useSocket: Token from localStorage:',
            token ? 'exists' : 'not found'
        )

        // Use localhost in development, Render URL in production
        const socketUrl = getSocketUrl()

        console.log(
            `Using socket URL: ${socketUrl} in ${process.env.NODE_ENV} mode`
        )

        const socketInstance = io(socketUrl, {
            withCredentials: true,
            transports: ['websocket'],
            auth: { token },
        })

        setSocket(socketInstance)

        socketInstance.on('connect', () => {
            setIsConnected(true)
            console.log('Socket connected successfully')
        })

        socketInstance.on('error', (error) => {
            setIsConnected(false)
            console.error('Socket error:', error)
        })

        socketInstance.on('online-users', (userId) => {
            setOnlineUsers((prev) => [...prev, userId])
            console.log('Online users:', userId)
        })

        return () => {
            socketInstance.disconnect()
        }
    }, [])

    return { socket, onlineUsers, isConnected }
}
