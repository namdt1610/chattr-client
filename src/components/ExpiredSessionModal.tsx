import React from 'react'
import { useRouter } from 'next/navigation'

interface ExpiredSessionModalProps {
    isOpen: boolean
    onClose: () => void
}

const ExpiredSessionModal: React.FC<ExpiredSessionModalProps> = ({
    isOpen,
    onClose,
}) => {
    const router = useRouter()

    if (!isOpen) return null

    const handleLogin = () => {
        router.push('/login')
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-opacity-50 backdrop-blur-xs "
                onClick={onClose}
            />

            {/* Modal */}
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="relative bg-white w-full max-w-md rounded-lg shadow-xl transform transition-all">
                    {/* Modal content */}
                    <div className="p-6">
                        <div className="flex items-center justify-center mb-5">
                            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
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
                            </div>
                        </div>

                        <h3 className="text-center text-lg font-medium text-zinc-900 mb-2">
                            Session Expired
                        </h3>

                        <p className="text-center text-zinc-600 mb-6">
                            Your session has expired. Please log in again to
                            continue.
                        </p>

                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <button
                                onClick={handleLogin}
                                className="w-full sm:w-auto px-6 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Log In
                            </button>
                            <button
                                onClick={onClose}
                                className="w-full sm:w-auto px-6 py-2 rounded-md border border-zinc-300 text-zinc-700 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ExpiredSessionModal
