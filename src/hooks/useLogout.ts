'use client'
import { useRouter } from 'next/navigation'
import useSWRMutation from 'swr/mutation'
import { buildApiUrl } from '@/utils/apiConfig'

async function logoutFetcher(url: string) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw { response: { data: error, status: response.status } }
    }

    return response.json()
}

export const useLogout = () => {
    const router = useRouter()

    const { trigger, isMutating: isLoading } = useSWRMutation(
        buildApiUrl('/api/auth/logout'),
        logoutFetcher,
        {
            onSuccess: () => {
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                // Dispatch event để báo hiệu đã logout
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('userLoggedOut'))
                }
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

    return { handleLogout, isLoading }
}
