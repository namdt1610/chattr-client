import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { User } from '@/types/user'

interface WelcomeStateProps {
    isLoggedIn: boolean
    selectedUser: User | null
    setShowLoginModal: (show: boolean) => void
}

const WelcomeState = ({
    isLoggedIn,
    selectedUser,
    setShowLoginModal,
}: WelcomeStateProps) => {
    if (selectedUser) return null
    return (
        <motion.div
            className="absolute inset-0 flex items-center justify-center bg-gray-50/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
        >
            <div className="text-center p-8 max-w-md">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                >
                    <div className="mx-auto bg-indigo-100 rounded-full p-6 w-24 h-24 flex items-center justify-center mb-6">
                        <MessageCircle size={36} className="text-indigo-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Welcome to ChatApp
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {isLoggedIn
                            ? 'Select a conversation from the sidebar to start chatting'
                            : 'Please log in to start chatting with other users'}
                    </p>
                    {!isLoggedIn && (
                        <motion.button
                            onClick={() => setShowLoginModal(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md transition-colors"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Log in
                        </motion.button>
                    )}
                </motion.div>
            </div>
        </motion.div>
    )
}

export default WelcomeState
