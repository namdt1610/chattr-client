'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import useSWRMutation from 'swr/mutation'
import { buildApiUrl } from '@/utils/apiConfig'

interface LoginCredentials {
    username: string
    password: string
}

interface LoginResponse {
    user: {
        _id: string
        username: string
    }
    access_token?: string
    refresh_token?: string
}

// Hàm fetcher sử dụng fetch API
async function loginFetcher(url: string, { arg }: { arg: LoginCredentials }) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(arg),
        credentials: 'include',
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw { response: { data: error, status: response.status } }
    }

    return response.json()
}

export function useLogin() {
    const [error, setError] = useState<string>('')
    const router = useRouter()

    const { trigger, isMutating: isLoading } = useSWRMutation<
        LoginResponse,
        Error,
        string,
        LoginCredentials
    >(buildApiUrl('/api/auth/login'), loginFetcher, {
        onSuccess: (data) => {
            console.log('Login response:', data)
            // Lưu token vào localStorage nếu có
            if (typeof window !== 'undefined' && data.access_token) {
                localStorage.setItem('accessToken', data.access_token)
                if (data.refresh_token) {
                    localStorage.setItem('refreshToken', data.refresh_token)
                }
                console.log('Tokens saved to localStorage')
            } else {
                console.log('No tokens in response')
            }

            // Set global state để báo hiệu đã login thành công
            if (typeof window !== 'undefined') {
                // Dispatch custom event để các component khác có thể lắng nghe
                window.dispatchEvent(
                    new CustomEvent('userLoggedIn', {
                        detail: { user: data.user },
                    })
                )
            }
            // Redirect về trang chat sau khi login thành công
            setTimeout(() => {
                router.push('/beta')
            }, 100)
        },
        onError: (err: any) => {
            // Xử lý lỗi từ API
            const message = err.response?.data?.message || 'Login failed'
            setError(message)
            console.error('Login error:', err)
        },
    })

    const login = async (credentials: LoginCredentials): Promise<void> => {
        setError('')
        try {
            await trigger(credentials)
        } catch {
            // Lỗi này sẽ được xử lý trong onError
        }
    }

    return { login, error, isLoading }
}
