import React from 'react'
import { motion } from 'framer-motion'

interface LoginButtonProps {
    onClick: () => void
}

const LoginButton: React.FC<LoginButtonProps> = ({ onClick }) => {
    return (
        <motion.button
            onClick={onClick}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
        >
            Log in
        </motion.button>
    )
}

export default LoginButton
