import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface LoginCredentials {
    username: string
    password: string
}

// Get API URL based on environment
const getApiUrl = () => {
    return process.env.NODE_ENV === 'production'
        ? 'https://chatapp-backend-l6tv.onrender.com'
        : 'http://localhost:5050'
}

export function useLogin() {
    const [error, setError] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const router = useRouter()

    const login = async ({
        username,
        password,
    }: LoginCredentials): Promise<void> => {
        setIsLoading(true)
        setError('')

        try {
            const apiUrl = getApiUrl()
            console.log(
                `Using API URL: ${apiUrl} in ${process.env.NODE_ENV} mode`
            )

            const response = await fetch(`${apiUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include',
            })

            const data = await response.json()

            if (response.ok) {
                console.log('Login successful:', data.accessToken)
                localStorage.setItem('accessToken', data.accessToken)
                alert('Login successful! Now connecting to WebSocket...')
                router.push('/beta')
            } else {
                setError(data.message || 'Login failed')
            }
        } catch (error) {
            setError('An error occurred during login')
            console.error('Login error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return { login, error, isLoading }
}
