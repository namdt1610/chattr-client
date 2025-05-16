import { User } from './user'
import { Message } from './message'

export interface Chat {
    conversationId: string
    partner: User
    lastMessage: Message
    lastMessageDate: string
    createdAt: string
    updatedAt: string
}
