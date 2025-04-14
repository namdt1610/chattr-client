import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface EmojiPickerProps {
  showEmojiPicker: boolean
  insertEmoji: (emoji: string) => void
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ showEmojiPicker, insertEmoji }) => {
  const emojis = ['😀', '😂', '😍', '🥰', '😎', '🙄', '😢', '😡', '🥳', '🤔', '👍', '👎', '❤️', '🔥', '🎉', '✨', '🌟', '💯', '🙏']
  
  return (
    <AnimatePresence>
      {showEmojiPicker && (
        <motion.div 
          className="absolute bottom-full mb-2 bg-white rounded-lg shadow-lg border border-gray-200 p-3 w-64 h-48"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          <div className="flex flex-wrap gap-2 overflow-y-auto h-full">
            {emojis.map(emoji => (
              <button 
                key={emoji} 
                onClick={() => insertEmoji(emoji)}
                className="text-2xl hover:bg-gray-100 p-1 rounded transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
          <div className="text-xs text-center text-gray-400 mt-2">
            This is a placeholder. Use an emoji picker library in production.
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default EmojiPicker