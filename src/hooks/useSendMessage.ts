import axios from 'axios'

export function useSendMessage({
      user,
      selectedUser,
      socket,
      setMessages,
}: {
      user: { username: string } | null
      selectedUser: string | null
      socket: any
      setMessages: (cb: (prev: any[]) => any[]) => void
}) {
      const sendMessage = (message: string) => {
            socket.emit('message', message)
            setMessages((prev) => [
                  ...prev,
                  { senderId: { username: 'You' }, content: message },
            ])
      }

      const sendPrivateMessage = async (message: string) => {
            if (!user || !selectedUser) return

            socket.emit('private_message', { to: selectedUser, message })
            setMessages((prev) => [
                  ...prev,
                  { senderId: { username: 'You' }, content: message },
            ])

            await axios.post(
                  'http://localhost:5050/api/messages/send',
                  {
                        senderUsername: user.username,
                        receiverUsername: selectedUser,
                        content: message,
                  },
                  { withCredentials: true }
            )
      }

      return { sendMessage, sendPrivateMessage }
}
