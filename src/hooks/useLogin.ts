'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import useSWRMutation from 'swr/mutation'
import api from '@/services/api'

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

// Hàm fetcher sử dụng API service
async function loginFetcher(url: string, { arg }: { arg: LoginCredentials }) {
    try {
        const response = await api.post(url, arg)
        return response.data
    } catch (error) {
        throw error
    }
}

export function useLogin() {
    const [error, setError] = useState<string>('')
    const router = useRouter()

    const { trigger, isMutating: isLoading } = useSWRMutation<
        LoginResponse,
        Error,
        string,
        LoginCredentials
    >('/api/auth/login', loginFetcher, {
        onSuccess: (data) => {
            // Lưu token và chuyển hướng người dùng
            router.push('/beta')
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
