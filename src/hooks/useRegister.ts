import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface RegisterCredentials {
    username: string
    email: string
    password: string
}

// Get API URL based on environment
const getApiUrl = () => {
    return process.env.NODE_ENV === 'production'
        ? 'https://chatapp-backend-l6tv.onrender.com'
        : 'http://localhost:5050'
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
            const apiUrl = getApiUrl()
            console.log(
                `Using API URL: ${apiUrl} in ${process.env.NODE_ENV} mode`
            )

            const response = await fetch(`${apiUrl}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
                credentials: 'include',
            })

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
