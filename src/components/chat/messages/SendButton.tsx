import React from 'react'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'

interface SendButtonProps {
  isDisabled: boolean
  message: string
  attachments: File[]
  handleSendMessage: () => void
}

const SendButton: React.FC<SendButtonProps> = ({ 
  isDisabled, 
  message, 
  attachments,
  handleSendMessage 
}) => {
  const canSend = !isDisabled && (message.trim() !== '' || attachments.length > 0)
  
  return (
    <motion.button
      whileHover={{ scale: canSend ? 1.1 : 1 }}
      whileTap={{ scale: canSend ? 0.9 : 1 }}
      className={`p-2 rounded-full ${
        canSend
          ? 'bg-indigo-500 hover:bg-indigo-600 text-white'
          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
      }`}
      onClick={handleSendMessage}
      disabled={!canSend}
    >
      <Send size={20} />
    </motion.button>
  )
}

export default SendButton