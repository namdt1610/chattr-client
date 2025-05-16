'use client'
import { useAPI } from './useSWRHook'
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
    const { data, error, isLoading, mutate } = useAPI<ApiChat[]>(
        userId ? `/messages/recent-chats/${userId}` : null,
        {
            revalidateOnFocus: true,
            dedupingInterval: 10000, // 10 seconds
        }
    )

    // Transform the data
    const chats = data ? data.map(mapToChat) : []

    return {
        chats,
        loading: isLoading,
        error: error?.message || null,
        mutate, // Expose mutate function to manually revalidate
    }
}
