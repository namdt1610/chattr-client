import { useState, useRef, useCallback, useEffect } from 'react'
import { debounce } from 'lodash'

interface UseMessageInputProps {
    message: string
    setMessage: React.Dispatch<React.SetStateAction<string>>
    sendTyping: () => void
    sendSeen: () => void
    sendMessage: (attachments?: File[]) => void
    isDisabled: boolean
}

export function useMessageInput({
    message,
    setMessage,
    sendTyping,
    sendSeen,
    sendMessage: originalSendMessage,
    isDisabled,
}: UseMessageInputProps) {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [attachments, setAttachments] = useState<File[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    const debouncedSendTyping = useCallback(
        debounce(() => {
            sendTyping()
        }, 500),
        [sendTyping]
    )

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setMessage(e.target.value)
            sendTyping()
        },
        [setMessage, sendTyping]
    )

    const handleSendMessage = useCallback(() => {
        if (message.trim() !== '' || attachments.length > 0) {
            originalSendMessage(attachments)
            setAttachments([])
        }
    }, [message, attachments, originalSendMessage])

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
            }
        },
        [handleSendMessage]
    )

    useEffect(() => {
        sendSeen()
    }, [message, sendSeen])

    useEffect(() => {
        return () => {
            debouncedSendTyping.cancel()
        }
    }, [debouncedSendTyping])

    const insertEmoji = useCallback(
        (emoji: string) => {
            setMessage((prev) => prev + emoji)
        },
        [setMessage]
    )

    const handleFileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files.length > 0) {
                const newFiles = Array.from(e.target.files)
                setAttachments((prev) => [...prev, ...newFiles])
            }
        },
        []
    )

    const removeAttachment = useCallback((index: number) => {
        setAttachments((prev) => prev.filter((_, i) => i !== index))
    }, [])

    const triggerFileInput = useCallback(() => {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }, [])

    const toggleEmojiPicker = useCallback(() => {
        setShowEmojiPicker((prev) => !prev)
    }, [])

    return {
        showEmojiPicker,
        attachments,
        fileInputRef,
        handleInputChange,
        handleKeyDown,
        handleSendMessage,
        insertEmoji,
        handleFileChange,
        removeAttachment,
        triggerFileInput,
        toggleEmojiPicker,
    }
}
