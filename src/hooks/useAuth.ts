import { useEffect, useState } from 'react'
import axios from 'axios'

export const useAuth = () => {
      const [user, setUser] = useState(null)
      const [isLoggedIn, setIsLoggedIn] = useState(false)

      useEffect(() => {
            axios
                  .get('http://localhost:5050/api/auth/me', {
                        headers: {
                              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                        },
                        withCredentials: true,
                  })
                  .then((res) => {
                        setUser(res.data.user)
                        setIsLoggedIn(true)
                  })
                  .catch(() => setIsLoggedIn(false))
      }, [])

      return { user, isLoggedIn }
}
