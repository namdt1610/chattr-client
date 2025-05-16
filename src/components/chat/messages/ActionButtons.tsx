import React from 'react'
import { motion } from 'framer-motion'
import { Smile, Paperclip, Image as ImageIcon, Film } from 'lucide-react'

interface ActionButtonsProps {
    toggleEmojiPicker: () => void
    triggerFileInput: () => void
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
    toggleEmojiPicker,
    triggerFileInput,
}) => {
    return (
        <div className="flex items-center ml-2 gap-1">
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-indigo-500 transition-colors"
                onClick={toggleEmojiPicker}
                aria-label="Open emoji picker"
            >
                <Smile size={20} />
            </motion.button>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-indigo-500 transition-colors"
                onClick={triggerFileInput}
                aria-label="Attach file"
            >
                <Paperclip size={20} />
            </motion.button>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-indigo-500 transition-colors"
                onClick={triggerFileInput}
                aria-label="Attach image"
            >
                <ImageIcon size={20} />
            </motion.button>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-indigo-500 transition-colors"
                onClick={() => alert('GIF picker would open here')}
                aria-label="Attach GIF"
            >
                <Film size={20} />
            </motion.button>
        </div>
    )
}

export default ActionButtons
