'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import useSWRMutation from 'swr/mutation'
import api from '@/services/api'

interface RegisterCredentials {
    username: string
    email: string
    password: string
}

interface RegisterResponse {
    message: string
    user: {
        _id: string
        username: string
        email: string
    }
}

async function registerFetcher(
    url: string,
    { arg }: { arg: RegisterCredentials }
) {
    try {
        const response = await api.post(url, arg)
        return response.data
    } catch (error) {
        throw error
    }
}

export function useRegister() {
    const [error, setError] = useState<string>('')
    const router = useRouter()

    const { trigger, isMutating: isLoading } = useSWRMutation<
        RegisterResponse,
        Error,
        string,
        RegisterCredentials
    >('/api/auth/register', registerFetcher, {
        onSuccess: () => {
            console.log('Registration successful!')
            router.push('/login')
        },
        onError: (err: any) => {
            const message = err.response?.data?.message || 'Registration failed'
            setError(message)
            console.error('Registration error:', err)
        },
    })

    const register = async (
        credentials: RegisterCredentials
    ): Promise<void> => {
        setError('')
        try {
            await trigger(credentials)
        } catch {
            // Lỗi này sẽ được xử lý trong onError
        }
    }

    return { register, error, isLoading }
}
