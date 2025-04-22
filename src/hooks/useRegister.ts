import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface RegisterCredentials {
    username: string
    email: string
    password: string
}

export function useRegister() {
    const [error, setError] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const router = useRouter()

    const register = async ({
        username,
        email,
        password,
    }: RegisterCredentials): Promise<void> => {
        setIsLoading(true)
        setError('')

        try {
            const response = await fetch(
                'http://localhost:5050/api/auth/register',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, email, password }),
                    credentials: 'include',
                }
            )

            const data = await response.json()

            if (response.ok) {
                console.log('Registration successful!')
                router.push('/login')
            } else {
                setError(data.message || 'Registration failed')
            }
        } catch (error) {
            setError('An error occurred during registration')
            console.error('Registration error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return { register, error, isLoading }
}
