import { useState } from 'react'
import axios from 'axios'

export const useSearchUser = () => {
      const [searchUser, setSearchUser] = useState('')
      const [userList, setUserList] = useState<{ username: string }[]>([])

      const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
            const query = e.target.value.trim()
            setSearchUser(query)

            if (query) {
                  try {
                        const res = await axios.get(`http://localhost:5050/api/users/${query}`, {
                              headers: { 'Content-Type': 'application/json' },
                              withCredentials: true,
                        })
                        setUserList(res.data)
                  } catch (error) {
                        console.error('Error fetching users:', error)
                  }
            } else {
                  setUserList([])
            }
      }

      return { searchUser, userList, handleSearch }
}