'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ConsoleLog from '@/components/ConsoleLog'
import { useConsoleLogs } from '@/hooks/useLogs'

const LoginPage = () => {
    const logs = useConsoleLogs()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const response = await fetch(
                'http://localhost:5050/api/auth/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                    credentials: 'include',
                }
            )

            const data = await response.json()
            if (response.ok) {
                console.log('Login successful:', data.accessToken)
                localStorage.setItem('accessToken', data.accessToken)
                alert('Login successful! Now connecting to WebSocket...')
                router.push('/beta')
            } else {
                const data = await response.json()
                setError(data.message || 'Login failed')
            }
        } catch (error) {
            setError('An error occurred during login')
        }
    }

    return (
        <div className="login-container w-full h-screen flex flex-col items-center  mx-32">
            {/* Logs Section */}
            <div className="w-full flex flex-col items-center justify-center my-12">
                <ConsoleLog logs={logs} />
            </div>

            {/* Login Page */}
            <div className="w-full flex flex-col items-center justify-center">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="w-full">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error">{error}</p>}
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    )
}

export default LoginPage
