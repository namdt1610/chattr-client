'use client'
import { useEffect, useState, useCallback } from 'react'
import io, { Socket } from 'socket.io-client'

interface UseChatStatusProps {
      socket: Socket | null
      conversationId: string | null
      userId: string | null | undefined
}

export const useChatStatus = ({socket, conversationId, userId }: UseChatStatusProps) => {
      const [isTyping, setIsTyping] = useState(false)
      const [isSeen, setIsSeen] = useState(false)

      useEffect(() => {
            if (!socket) {
                  socket = io('http://localhost:5050')
            }

            socket.emit('join', conversationId)

            socket.on('typing', ({ senderId }) => {
                  if (senderId !== userId) {
                        setIsTyping(true)
                        setTimeout(() => setIsTyping(false), 2000)
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
      }, [conversationId, userId])

      const sendTyping = useCallback(() => {
            socket?.emit('typing', { conversationId, senderId: userId })
      }, [conversationId, userId])

      const sendSeen = useCallback(() => {
            socket?.emit('seen', { conversationId, userId })
      }, [conversationId, userId])

      return {
            isTyping,
            isSeen,
            sendTyping,
            sendSeen,
      }
}
