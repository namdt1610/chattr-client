'use client'
import { useEffect, useState, useCallback, useRef } from 'react'
import { Socket } from 'socket.io-client'

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
        if (!socket || !conversationId || !userId) return

        socket.on(
            'chat:typing',
            ({ userId: typingUserId, isTyping: typing }) => {
                if (typingUserId !== userId) {
                    setIsSeen(false)
                    setIsTyping(typing)

                    // Reset trạng thái typing sau một khoảng thời gian
                    if (typing && typingTimeoutRef.current) {
                        clearTimeout(typingTimeoutRef.current)
                    }

                    if (typing) {
                        typingTimeoutRef.current = setTimeout(() => {
                            setIsTyping(false)
                            typingTimeoutRef.current = null
                        }, 3000)
                    }
                }
            }
        )

        socket.on('chat:seen', ({ userId: seenUserId }) => {
            if (seenUserId !== userId) {
                setIsSeen(true)
                // Tự động ẩn chỉ báo "seen" sau một khoảng thời gian
                setTimeout(() => {
                    setIsSeen(false)
                }, 5000)
            }
        })

        return () => {
            socket?.off('chat:typing')
            socket?.off('chat:seen')
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current)
            }
        }
    }, [socket, conversationId, userId])

    const sendTyping = useCallback(() => {
        if (socket && conversationId && userId) {
            socket.emit('chat:typing', { conversationId, isTyping: true })
        }
    }, [socket, conversationId, userId])

    const sendStopTyping = useCallback(() => {
        if (socket && conversationId && userId) {
            socket.emit('chat:typing', { conversationId, isTyping: false })
        }
    }, [socket, conversationId, userId])

    const sendSeen = useCallback(() => {
        if (socket && conversationId && userId) {
            socket.emit('chat:seen', { conversationId })
        }
    }, [socket, conversationId, userId])

    return {
        isTyping,
        isSeen,
        sendTyping,
        sendStopTyping,
        sendSeen,
    }
}
