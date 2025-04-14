import { useState, useRef } from 'react'

interface UseMessageInputProps {
  message: string
  setMessage: React.Dispatch<React.SetStateAction<string>>
  sendTyping: () => void
  sendSeen: () => void
  sendMessage: () => void
  isDisabled: boolean
}

export function useMessageInput({
  message,
  setMessage,
  sendTyping,
  sendSeen,
  sendMessage: originalSendMessage,
  isDisabled
}: UseMessageInputProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [attachments, setAttachments] = useState<File[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
    sendTyping()
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }
  
  const handleSendMessage = () => {
    if (message.trim() !== '' || attachments.length > 0) {
      originalSendMessage()
      // In a real app, you'd handle attachments upload here
      setAttachments([])
    }
  }
  
  const insertEmoji = (emoji: string) => {
    setMessage(prev => prev + emoji)
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setAttachments(prev => [...prev, ...newFiles])
    }
  }
  
  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }
  
  const toggleRecording = () => {
    setIsRecording(!isRecording)
  }
  
  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker)
  }

  return {
    showEmojiPicker,
    attachments,
    isRecording,
    fileInputRef,
    handleInputChange,
    handleKeyDown,
    handleSendMessage,
    insertEmoji,
    handleFileChange,
    removeAttachment,
    triggerFileInput,
    toggleRecording,
    toggleEmojiPicker
  }
}