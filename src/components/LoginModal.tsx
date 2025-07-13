'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLogin } from '@/hooks/useLogin'

interface LoginModalProps {
    isOpen: boolean
    onClose: () => void
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const { login, error, isLoading } = useLogin()
    const [isVisible, setIsVisible] = useState(false)

    // Handle the animation state based on the isOpen prop
    useEffect(() => {
        if (isOpen) {
            setIsVisible(true)
        }
    }, [isOpen])

    // Actual close handler that triggers the animation first
    const handleClose = () => {
        setIsVisible(false)
        // Delay the actual closing to allow animation to complete
        setTimeout(() => {
            onClose()
        }, 300)
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        await login({ username, password })
        // Modal will be closed automatically when login succeeds
        // because isLoggedIn will change and trigger useEffect in parent
    }

    if (!isOpen && !isVisible) return null

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Overlay with animation */}
            <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                onClick={handleClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: isVisible ? 1 : 0 }}
                transition={{ duration: 0.3 }}
            />

            {/* Modal with animation */}
            <div className="flex min-h-screen items-center justify-center p-4">
                <motion.div
                    className="relative bg-white w-full max-w-md rounded-lg shadow-xl"
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{
                        opacity: isVisible ? 1 : 0,
                        y: isVisible ? 0 : 20,
                        scale: isVisible ? 1 : 0.95,
                    }}
                    transition={{
                        type: 'spring',
                        damping: 25,
                        stiffness: 300,
                    }}
                >
                    {/* Color accent top bar */}
                    <div className="h-1.5 bg-indigo-500 rounded-t-lg"></div>

                    {/* Modal content */}
                    <div className="p-6">
                        <div className="flex items-center justify-center mb-5">
                            <motion.div
                                className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center"
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 300,
                                    damping: 15,
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-indigo-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <h3 className="text-center text-lg font-medium text-zinc-900 mb-2">
                                Welcome Back
                            </h3>

                            <p className="text-center text-zinc-600 mb-6">
                                Sign in to continue to ChatApp
                            </p>
                        </motion.div>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Username
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="username"
                                    required
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    disabled={isLoading}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Enter your username"
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    disabled={isLoading}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Enter your password"
                                />
                            </motion.div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-600 text-sm text-center"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <motion.div
                                className="flex flex-col gap-3 sm:flex-row sm:justify-center"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <motion.button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full sm:w-auto px-6 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 400,
                                        damping: 10,
                                    }}
                                >
                                    {isLoading ? 'Signing in...' : 'Sign In'}
                                </motion.button>
                                <motion.button
                                    type="button"
                                    onClick={handleClose}
                                    className="w-full sm:w-auto px-6 py-2 rounded-md border border-zinc-300 text-zinc-700 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 400,
                                        damping: 10,
                                    }}
                                >
                                    Cancel
                                </motion.button>
                            </motion.div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default LoginModal
