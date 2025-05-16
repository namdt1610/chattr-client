import { Attachment } from './attachment'
import { User } from './user'

export interface Message {
    id: string
    content: string
    createdAt: string
    updatedAt: string
    attachments: Attachment[]
    sender: User
}
