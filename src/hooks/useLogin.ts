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
    const _router = useRouter()

    const { trigger, isMutating: isLoading } = useSWRMutation<
        LoginResponse,
        Error,
        string,
        LoginCredentials
    >(buildApiUrl('/api/auth/login'), loginFetcher, {
        onSuccess: (data) => {
            // Set global state để báo hiệu đã login thành công
            if (typeof window !== 'undefined') {
                // Dispatch custom event để các component khác có thể lắng nghe
                window.dispatchEvent(
                    new CustomEvent('userLoggedIn', {
                        detail: { user: data.user },
                    })
                )
            }
            // Không redirect nữa, chỉ set global state
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
