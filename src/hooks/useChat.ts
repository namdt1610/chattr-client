'use client'
import { useState, useEffect, useRef, useMemo } from 'react'
import { Socket } from 'socket.io-client'
import { Message } from '@/types/message'
import { User } from '@/types/user'
import { Attachment } from '@/types/attachment'
import { useAPI } from './useSWRHook'
import api from '@/services/api'

// Local types for socket message response
interface MessageResponse {
    from: string
    message: string
    conversationId: string
    attachments?: Attachment[]
}

// Định nghĩa response từ API
interface MessageHistoryResponse {
    messages: Message[]
}

export const useChat = (
    socket: Socket | null,
    user: User | null,
    selectedUser: User | null
) => {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState<Message[]>([])
    const [isAtBottom, setIsAtBottom] = useState(true)
    const [hasNewMessage, setHasNewMessage] = useState(false)
    const chatContainerRef = useRef<HTMLDivElement>(null)

    const conversationId = useMemo(() => {
        if (!user?._id || !selectedUser?._id) return null
        return [user._id, selectedUser._id].sort().join('_')
    }, [user?._id, selectedUser?._id])

    // Sử dụng useAPI để lấy lịch sử tin nhắn
    const { mutate: refreshMessages } = useAPI<MessageHistoryResponse>(
        conversationId
            ? `/api/messages/history?conversationId=${conversationId}`
            : null,
        {
            revalidateOnFocus: false,
            onSuccess: (data) => {
                if (data?.messages && Array.isArray(data.messages)) {
                    setMessages(data.messages)
                }
            },
        }
    )

    // Join room (conversation) on socket connection
    useEffect(() => {
        if (!socket || !user?._id || !selectedUser?._id || !conversationId) {
            console.log('Socket or user information is missing!')
            console.log('user:', user, 'selectedUser:', selectedUser)
            return
        }

        socket.emit('chat:join_room', conversationId)
        console.log(`🚪 User ${user._id} joined room: ${conversationId}`)

        return () => {
            socket.emit('chat:leave_room', conversationId) // Leave room when component unmounts
        }
    }, [socket, user, selectedUser, conversationId])

    useEffect(() => {
        if (!selectedUser) {
            console.log('No user selected!')
            return // Do nothing if no selectedUser
        }

        console.log('Selected user:', selectedUser)
        // Perform operations when there is a selectedUser
    }, [selectedUser])

    // Handle scroll behavior
    const handleScroll = () => {
        if (!chatContainerRef.current) return
        const { scrollTop, scrollHeight, clientHeight } =
            chatContainerRef.current
        const isBottom = scrollTop + clientHeight >= scrollHeight - 10

        setIsAtBottom(isBottom)
        if (isBottom) setHasNewMessage(false)
    }

    const scrollToBottom = () => {
        chatContainerRef.current?.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: 'smooth',
        })
    }

    // Set new message notification
    useEffect(() => {
        if (!isAtBottom) setHasNewMessage(true)
        if (isAtBottom) {
            scrollToBottom()
        }
    }, [messages, isAtBottom])

    // Socket message listeners
    useEffect(() => {
        if (!socket) return

        socket.off('chat:message')
        socket.off('chat:private_message')

        const handleMessage = (msg: string) => {
            // Create a valid Message object
            const newMessage: Message = {
                id: '',
                content: msg,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                attachments: [],
                sender: {
                    _id: 'system',
                    username: 'System',
                    email: '',
                    avatar: '',
                    createdAt: '',
                    updatedAt: '',
                },
            }

            setMessages((prev) => [...prev, newMessage])
        }

        const handlePrivateMessage = (msg: MessageResponse) => {
            if (msg.conversationId !== conversationId) return
            console.log(
                `${selectedUser?.username} nhận tin nhắn từ ${msg.from}: ${msg.message}, ${msg.attachments}`
            )

            // Map socket message to valid Message type
            const newMessage: Message = {
                id: '',
                content: msg.message,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                attachments: msg.attachments || [],
                sender: {
                    _id: '',
                    username: msg.from,
                    email: '',
                    avatar: '',
                    createdAt: '',
                    updatedAt: '',
                },
            }

            setMessages((prev) => [...prev, newMessage])
            setMessage('')

            // Refresh message history to ensure consistency
            refreshMessages()
        }

        socket.on('chat:message', handleMessage)
        socket.on('chat:private_message', handlePrivateMessage)

        return () => {
            socket.off('chat:message', handleMessage)
            socket.off('chat:private_message', handlePrivateMessage)
        }
    }, [socket, selectedUser, user, conversationId, refreshMessages])

    const sendMessage = () => {
        if (!socket || !message.trim()) return

        const newMessage: Message = {
            id: '',
            content: message,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            attachments: [],
            sender: user || {
                _id: '',
                username: 'Anonymous',
                email: '',
                avatar: '',
                createdAt: '',
                updatedAt: '',
            },
        }

        socket.emit('chat:message', message)
        setMessages((prev) => [...prev, newMessage])
        setMessage('')
    }

    const sendPrivateMessage = async (attachments?: File[]) => {
        if (
            !socket ||
            (!message.trim() && (!attachments || attachments.length === 0))
        )
            return
        if (!selectedUser?._id || !user?._id || !conversationId) {
            console.error('Missing user information for private message')
            return
        }

        try {
            // Prepare form data if there are attachments
            if (attachments && attachments.length > 0) {
                const formData = new FormData()
                formData.append('text', message)
                formData.append('to', selectedUser._id)
                formData.append('conversationId', conversationId)

                attachments.forEach((file) => {
                    formData.append('attachments', file)
                })

                // Send message with attachments via API
                await api.post('/api/messages/send', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
            } else {
                // Send simple text message via socket
                socket.emit('chat:private_message', {
                    to: selectedUser._id,
                    message,
                    conversationId,
                })
            }

            // Add message to UI
            const newMessage: Message = {
                id: '',
                content: message,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                attachments: [],
                sender: user || {
                    _id: '',
                    username: 'Anonymous',
                    email: '',
                    avatar: '',
                    createdAt: '',
                    updatedAt: '',
                },
            }

            setMessages((prev) => [...prev, newMessage])
            setMessage('')

            // Refresh message history
            refreshMessages()
        } catch (error) {
            console.error('Error sending private message:', error)
        }
    }

    return {
        message,
        setMessage,
        messages,
        setMessages,
        sendMessage,
        sendPrivateMessage,
        chatContainerRef,
        handleScroll,
        scrollToBottom,
        hasNewMessage,
        conversationId,
        refreshMessages,
    }
}
