import { useState, useRef, useCallback, useEffect } from 'react'
import debounce from 'lodash/debounce'

interface UseMessageInputProps {
    message: string
    setMessage: React.Dispatch<React.SetStateAction<string>>
    sendTyping: () => void
    sendStopTyping: () => void
    sendSeen: () => void
    sendMessage: (attachments?: File[]) => void
    isDisabled: boolean
}

export function useMessageInput({
    message,
    setMessage,
    sendTyping,
    sendStopTyping,
    sendSeen,
    sendMessage: originalSendMessage,
    isDisabled,
}: UseMessageInputProps) {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [attachments, setAttachments] = useState<File[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)
    const typingTimerRef = useRef<NodeJS.Timeout | null>(null)

    // Tạo debounce function ở ngoài useCallback để tránh lỗi dependencies
    const debouncedSendTypingRef = useRef<Function | undefined>(undefined)

    // Khởi tạo debounced function trong useEffect để đảm bảo dependencies được cập nhật
    useEffect(() => {
        debouncedSendTypingRef.current = debounce(() => {
            sendTyping()

            if (typingTimerRef.current) {
                clearTimeout(typingTimerRef.current)
            }

            typingTimerRef.current = setTimeout(() => {
                sendStopTyping()
                typingTimerRef.current = null
            }, 2000)
        }, 300)

        // Cleanup
        return () => {
            if (
                typeof debouncedSendTypingRef.current === 'function' &&
                'cancel' in debouncedSendTypingRef.current
            ) {
                ;(debouncedSendTypingRef.current as any).cancel()
            }
            if (typingTimerRef.current) {
                clearTimeout(typingTimerRef.current)
            }
        }
    }, [sendTyping, sendStopTyping])

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setMessage(e.target.value)
            if (debouncedSendTypingRef.current) {
                ;(debouncedSendTypingRef.current as Function)()
            }
        },
        [setMessage]
    )

    const handleSendMessage = useCallback(() => {
        if (message.trim() !== '' || attachments.length > 0) {
            originalSendMessage(attachments)
            setMessage('')
            setAttachments([])
            sendStopTyping()

            if (typingTimerRef.current) {
                clearTimeout(typingTimerRef.current)
                typingTimerRef.current = null
            }
        }
    }, [message, attachments, originalSendMessage, setMessage, sendStopTyping])

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
        if (message === '') {
            sendSeen()
        }
    }, [message, sendSeen])

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
        [setAttachments]
    )

    const removeAttachment = useCallback(
        (index: number) => {
            setAttachments((prev) => prev.filter((_, i) => i !== index))
        },
        [setAttachments]
    )

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
        isDisabled,
    }
}
