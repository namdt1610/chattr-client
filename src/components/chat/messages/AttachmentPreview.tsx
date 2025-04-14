import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Paperclip, X } from 'lucide-react'

interface AttachmentPreviewProps {
  attachments: File[]
  removeAttachment: (index: number) => void
}

const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({ 
  attachments, 
  removeAttachment 
}) => {
  if (attachments.length === 0) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div 
        className="flex gap-2 p-2 mb-2 overflow-x-auto bg-white rounded-md shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
      >
        {attachments.map((file, index) => (
          <div key={index} className="relative group">
            <div className="w-16 h-16 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden">
              {file.type.startsWith('image/') ? (
                <img 
                  src={URL.createObjectURL(file)} 
                  alt={file.name} 
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="text-xs text-gray-500 text-center p-1">
                  <Paperclip size={14} className="mx-auto mb-1" />
                  <span className="truncate block">{file.name.slice(0, 10)}...</span>
                </div>
              )}
            </div>
            <button 
              onClick={() => removeAttachment(index)}
              className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={10} className="text-white" />
            </button>
          </div>
        ))}
      </motion.div>
    </AnimatePresence>
  )
}

export default AttachmentPreview