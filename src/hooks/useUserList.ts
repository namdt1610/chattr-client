import { useEffect, useState } from 'react'

export function useUserList({ socket }: { socket: any }) {
      const [userList, setUserList] = useState<{ username: string; _id: string }[]>([])

      useEffect(() => {
            if (!socket) return

            const handleUserList = (users: any[]) => {
                  setUserList(users)
            }

            socket.on('user_list', handleUserList)
            socket.emit('get_user_list')

            return () => {
                  socket.off('user_list', handleUserList)
            }
      }, [socket])

      return { userList }
}
