import React from 'react'
import { motion } from 'framer-motion'
import { Mic } from 'lucide-react'

interface RecordButtonProps {
  isRecording: boolean
  toggleRecording: () => void
}

const RecordButton: React.FC<RecordButtonProps> = ({ isRecording, toggleRecording }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`p-2 rounded-full transition-colors ${
        isRecording 
          ? 'bg-red-500 text-white' 
          : 'text-gray-500 hover:bg-gray-100 hover:text-indigo-500'
      }`}
      onClick={toggleRecording}
    >
      <Mic size={20} />
    </motion.button>
  )
}

export default RecordButton