'use client'

import { useState } from 'react'
import ConsoleLog from '@/components/ConsoleLog'
import { useConsoleLogs } from '@/hooks/useLogs'
import { useRegister } from '@/hooks/useRegister'
import Link from 'next/link'
import { motion } from 'framer-motion'

const RegisterPage = () => {
    const logs = useConsoleLogs()
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const { register, error, isLoading } = useRegister()

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            return // Error sẽ được xử lý trong hook useRegister
        }

        await register({ username, email, password })
    }

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: 'beforeChildren',
                staggerChildren: 0.1,
                duration: 0.3,
            },
        },
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
    }

    return (
        <motion.div
            className="overflow-hidden min-h-screen w-full bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Logs Section - Collapsible and minimized by default */}
            <motion.div
                className="w-full bg-white shadow-sm p-2"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
            >
                <details className="w-full">
                    <summary className="text-sm text-gray-500 cursor-pointer hover:text-indigo-600 font-medium">
                        Console Logs
                    </summary>
                    <div className="p-2 max-h-40 overflow-y-auto">
                        <ConsoleLog logs={logs} />
                    </div>
                </details>
            </motion.div>

            {/* Register Card */}
            <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{
                        boxShadow:
                            '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.div variants={itemVariants}>
                        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
                            Create account
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Join ChatApp and start connecting
                        </p>
                    </motion.div>

                    <form className="mt-8 space-y-6" onSubmit={handleRegister}>
                        <div className="space-y-4 rounded-md">
                            <motion.div variants={itemVariants}>
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Username
                                </label>
                                <div className="mt-1">
                                    <motion.input
                                        whileFocus={{ scale: 1.01 }}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 400,
                                        }}
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
                                        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Choose a username"
                                    />
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Email
                                </label>
                                <div className="mt-1">
                                    <motion.input
                                        whileFocus={{ scale: 1.01 }}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 400,
                                        }}
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        disabled={isLoading}
                                        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Your email address"
                                    />
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Password
                                </label>
                                <div className="mt-1">
                                    <motion.input
                                        whileFocus={{ scale: 1.01 }}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 400,
                                        }}
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        disabled={isLoading}
                                        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Create a password"
                                    />
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Confirm Password
                                </label>
                                <div className="mt-1">
                                    <motion.input
                                        whileFocus={{ scale: 1.01 }}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 400,
                                        }}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                        disabled={isLoading}
                                        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Confirm your password"
                                    />
                                </div>
                            </motion.div>
                        </div>

                        {error && (
                            <motion.div
                                className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-md p-3"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {error}
                            </motion.div>
                        )}

                        <motion.div variants={itemVariants}>
                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 400,
                                    damping: 10,
                                }}
                            >
                                {isLoading ? (
                                    <>
                                        <svg
                                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Creating account...
                                    </>
                                ) : (
                                    'Create account'
                                )}
                            </motion.button>
                        </motion.div>

                        <motion.div
                            className="text-sm text-center"
                            variants={itemVariants}
                        >
                            <p className="text-gray-600">
                                Already have an account?{' '}
                                <motion.span
                                    whileHover={{
                                        color: '#4338ca',
                                        scale: 1.05,
                                    }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 400,
                                    }}
                                >
                                    <Link
                                        href="/login"
                                        className="font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                        Sign in
                                    </Link>
                                </motion.span>
                            </p>
                        </motion.div>
                    </form>
                </motion.div>
            </div>

            <motion.footer
                className="w-full py-4 text-center text-gray-500 text-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
            >
                © {new Date().getFullYear()} ChatApp. All rights reserved.
            </motion.footer>
        </motion.div>
    )
}

export default RegisterPage
