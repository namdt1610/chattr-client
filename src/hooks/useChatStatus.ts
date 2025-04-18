'use client'
import { useEffect, useState, useCallback, useRef } from 'react'
import io, { Socket } from 'socket.io-client'

interface UseChatStatusProps {
    socket: Socket | null
    conversationId: string | null
    userId: string | null | undefined
}

export const useChatStatus = ({
    socket,
    conversationId,
    userId,
}: UseChatStatusProps) => {
    const [isTyping, setIsTyping] = useState(false)
    const [isSeen, setIsSeen] = useState(false)
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if (!socket) {
            socket = io('http://localhost:5050')
        }

        socket.emit('join', conversationId)

        socket.on('typing', ({ senderId }) => {
            if (senderId !== userId) {
                setIsTyping(true)

                if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current)
                }

                typingTimeoutRef.current = setTimeout(() => {
                    setIsTyping(false)
                    typingTimeoutRef.current = null
                }, 2000)
            }
        })

        socket.on('seen', ({ userId: seenUserId }) => {
            if (seenUserId !== userId) {
                setIsSeen(true)
            }
        })

        return () => {
            socket?.off('typing')
            socket?.off('seen')
        }
    }, [socket, conversationId, userId])

    const sendTyping = useCallback(() => {
        if (socket && conversationId && userId) {
            socket.emit('typing', { conversationId, senderId: userId })
        }
    }, [socket, conversationId, userId])

    const sendSeen = useCallback(() => {
        if (socket && conversationId && userId) {
            socket.emit('seen', { conversationId, userId })
        }
    }, [socket, conversationId, userId])

    return {
        isTyping,
        isSeen,
        sendTyping,
        sendSeen,
    }
}
