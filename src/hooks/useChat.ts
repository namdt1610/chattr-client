import { useState, useEffect, useRef, useMemo } from 'react'
import api from '../services/api'
import { Socket } from 'socket.io-client'
import { Message as MessageType } from '@/types/message'
import { User as UserType } from '@/types/user'

// Local types for MessageResponse from socket
interface MessageResponse {
    from: string
    message: string
    conversationId: string
    attachments?: Array<{
        id: string
        filename: string
        fileType: string
        fileSize: number
        fileUrl: string
    }>
}

// Define a type for the API message response
interface ApiMessage {
    id?: string
    content: string
    createdAt?: string
    updatedAt?: string
    attachments?: Array<{
        id: string
        filename: string
        fileType: string
        fileSize: number
        fileUrl: string
    }>
    sender?: {
        _id: string
        username: string
        email?: string
        avatar?: string
        createdAt?: string
        updatedAt?: string
    }
}

export const useChat = (
    socket: Socket | null,
    user: UserType | null,
    selectedUser: UserType | null
) => {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState<MessageType[]>([])
    const [isAtBottom, setIsAtBottom] = useState(true)
    const [hasNewMessage, setHasNewMessage] = useState(false)
    const chatContainerRef = useRef<HTMLDivElement>(null)
    const conversationId = useMemo(() => {
        if (!user?._id || !selectedUser?._id) return null
        return [user._id, selectedUser._id].sort().join('_')
    }, [user?._id, selectedUser?._id])

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
            const newMessage: MessageType = {
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
            const newMessage: MessageType = {
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
        }

        socket.on('chat:message', handleMessage)
        socket.on('chat:private_message', handlePrivateMessage)

        return () => {
            socket.off('chat:message', handleMessage)
            socket.off('chat:private_message', handlePrivateMessage)
        }
    }, [socket, selectedUser, user, conversationId])

    // Load message history
    useEffect(() => {
        console.log('Loading message history...')
        if (!selectedUser?._id || !user?._id || !conversationId) {
            console.log('Missing selectedUser or user information!')
            console.log(
                'Details:',
                'selectedUser:',
                selectedUser,
                'user:',
                user
            )
            return
        }
        setMessages([])

        api.get(`/api/messages/history?conversationId=${conversationId}`, {
            withCredentials: true,
        }).then((res) => {
            console.log('Message history:', res.data.messages)
            // Ensure messages meet the expected Message type interface
            setMessages(
                res.data.messages.map((msg: ApiMessage) => ({
                    ...msg,
                    id: msg.id || '',
                    attachments: msg.attachments || [],
                    sender: msg.sender || {
                        _id: '',
                        username: 'Unknown',
                        email: '',
                        avatar: '',
                        createdAt: '',
                        updatedAt: '',
                    },
                    createdAt: msg.createdAt || new Date().toISOString(),
                    updatedAt: msg.updatedAt || new Date().toISOString(),
                }))
            )
            setTimeout(() => {
                scrollToBottom()
            }, 100)
        })
    }, [selectedUser, user, conversationId])

    // Send message functions
    const sendMessage = () => {
        if (!message.trim() || !socket) return

        socket.emit('chat:message', message)

        // Create a valid Message object for the UI
        const newMessage: MessageType = {
            id: '',
            content: message,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            attachments: [],
            sender: {
                _id: user?._id || '',
                username: 'You',
                email: '',
                avatar: '',
                createdAt: '',
                updatedAt: '',
            },
        }

        setMessages((prev) => [...prev, newMessage])
        setMessage('')
    }

    const sendPrivateMessage = async (attachments?: File[]) => {
        if (
            !selectedUser?._id ||
            (!message?.trim() && (!attachments || attachments.length === 0)) ||
            !socket ||
            !user?.username
        ) {
            console.log('Missing required information to send message!')
            console.log(
                '\nselectedUser:',
                selectedUser,
                '\nmessage:',
                message,
                '\nattachments:',
                attachments,
                '\nuser:',
                user
            )
            return
        }

        console.log(
            `${user.username} gửi tin nhắn đến ${
                selectedUser?.username
            }: ${message}, ${
                attachments
                    ? attachments.map((file) => file.name).join(', ')
                    : 'No attachments'
            }`
        )
        socket.emit('chat:private_message', {
            conversationId,
            receiver: selectedUser,
            message,
            attachments:
                attachments && attachments.length > 0 ? attachments : null,
        })

        try {
            console.log(selectedUser._id)
            console.log(message)

            // Create FormData for handling both text and file uploads
            const formData = new FormData()
            formData.append('selectedUserId', selectedUser._id)
            formData.append('content', message)

            // Add attachments if they exist
            if (attachments && attachments.length > 0) {
                attachments.forEach((file) => {
                    formData.append('attachments', file)
                })
            }

            for (const [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`)
            }

            const response = await api.post('/api/messages/send', formData, {
                withCredentials: true,
            })

            console.log('Message sent successfully:', response.data)
            setMessage('')
        } catch (error) {
            console.error('Error sending message:', error)
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
    }
}
