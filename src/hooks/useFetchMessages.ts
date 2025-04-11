import { useEffect, useState } from 'react'

export function useFetchMessages({ socket, selectedUser }: {
      socket: any
      selectedUser: string | null
}) {
      const [messages, setMessages] = useState<any[]>([])
      const [message, setMessage] = useState('')

      useEffect(() => {
            if (!socket) return

            const handleMessage = (msg: any) => {
                  setMessages((prev) => [...prev, msg])
            }

            socket.on('private_message', handleMessage)

            return () => {
                  socket.off('private_message', handleMessage)
            }
      }, [socket])

      const filteredMessages = messages.filter(
            (msg) => msg.senderId.username === selectedUser || msg.senderId.username === 'You'
      )

      return {
            messages,
            setMessages,
            message,
            setMessage,
            filteredMessages,
      }
}
