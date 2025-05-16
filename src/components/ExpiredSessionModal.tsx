import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

interface ExpiredSessionModalProps {
    isOpen: boolean
    onClose: () => void
}

const ExpiredSessionModal: React.FC<ExpiredSessionModalProps> = ({
    isOpen,
    onClose,
}) => {
    const router = useRouter()
    // Local state to handle the animation
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
        }, 300) // 300ms matches the animation duration
    }

    const handleLogin = () => {
        setIsVisible(false)
        // Delay the navigation to allow animation to complete
        setTimeout(() => {
            router.push('/login')
            onClose()
        }, 300)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Overlay with animation */}
            <motion.div
                className="fixed inset-0 bg-opacity-50 backdrop-blur-sm"
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
                    <div className="h-1.5 bg-amber-500 rounded-t-lg"></div>

                    {/* Modal content */}
                    <div className="p-6">
                        <div className="flex items-center justify-center mb-5">
                            <motion.div
                                className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center"
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
                                    className="h-6 w-6 text-amber-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
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
                                Session Expired
                            </h3>

                            <p className="text-center text-zinc-600 mb-6">
                                Your session has expired. Please log in again to
                                continue.
                            </p>
                        </motion.div>

                        <motion.div
                            className="flex flex-col gap-3 sm:flex-row sm:justify-center"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <motion.button
                                onClick={handleLogin}
                                className="w-full sm:w-auto px-6 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 400,
                                    damping: 10,
                                }}
                            >
                                Log In
                            </motion.button>
                            <motion.button
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
                                Continue as Guest
                            </motion.button>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default ExpiredSessionModal
