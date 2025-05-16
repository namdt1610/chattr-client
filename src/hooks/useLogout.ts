'use client'
import { useRouter } from 'next/navigation'
import useSWRMutation from 'swr/mutation'
import api from '@/services/api'

async function logoutFetcher(url: string) {
    try {
        const response = await api.post(url, {}, { withCredentials: true })
        return response.data
    } catch (error) {
        throw error
    }
}

export const useLogout = () => {
    const router = useRouter()

    const { trigger, isMutating } = useSWRMutation(
        '/api/auth/logout',
        logoutFetcher,
        {
            onSuccess: () => {
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                router.push('/login')
            },
            onError: (error) => {
                console.error('Logout failed', error)
            },
        }
    )

    const handleLogout = async () => {
        try {
            await trigger()
        } catch {
            // Lỗi này sẽ được xử lý trong onError
        }
    }

    return { handleLogout, isLoading: isMutating }
}
