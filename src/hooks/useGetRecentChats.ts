import { useState, useEffect } from 'react'
import api from '@/services/api'
import { Chat } from '@/types/chat'

// Define the API chat structure
interface ApiChat {
    conversationId: string
    partner: {
        _id: string
        username: string
        avatar: string
    }
    lastMessage: string
    createdAt: string
}

// Map API response to match our Chat type interface
const mapToChat = (apiChat: ApiChat): Chat => ({
    conversationId: apiChat.conversationId,
    partner: {
        _id: apiChat.partner._id,
        username: apiChat.partner.username,
        email: '', // Placeholder
        avatar: apiChat.partner.avatar || '',
        createdAt: '', // Placeholder
        updatedAt: '', // Placeholder
    },
    lastMessage: {
        id: '', // Placeholder
        content: apiChat.lastMessage,
        sender: {
            // Placeholder sender
            _id: '',
            username: '',
            email: '',
            avatar: '',
            createdAt: '',
            updatedAt: '',
        },
        createdAt: apiChat.createdAt,
        updatedAt: apiChat.createdAt,
        attachments: [],
    },
    lastMessageDate: apiChat.createdAt,
    createdAt: apiChat.createdAt,
    updatedAt: apiChat.createdAt, // Using createdAt as a fallback
})

export const useRecentChats = (userId: string) => {
    const [chats, setChats] = useState<Chat[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchChats = async () => {
            setChats([])
            setLoading(true)
            try {
                const response = await api.get(
                    `${process.env.NEXT_PUBLIC_BASE_API_URL}/messages/recent-chats/${userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                'accessToken'
                            )}`,
                        },
                    }
                )
                // Map API response to match our Chat type
                setChats(response.data.map(mapToChat))
            } catch (error: unknown) {
                setError('Error fetching chats')
                console.error('Failed to fetch recent chats:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchChats()
    }, [userId]) // Run again when userId changes

    return { chats, loading, error }
}
