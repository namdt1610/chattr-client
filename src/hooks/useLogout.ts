'use client'
import axios from "axios"
import { useRouter } from "next/navigation"

export const useLogout = () => {
      const router = useRouter()
      const handleLogout = async () => {
            try {
                  await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/logout`,
                        {},
                        { withCredentials: true }
                  )
                  localStorage.removeItem("accessToken")
                  router.push("/login")
            } catch (error) {
                  console.error("Logout failed", error)
            }
      }

      return { handleLogout }
}
