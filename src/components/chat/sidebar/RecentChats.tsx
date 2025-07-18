import React from 'react'
import { formatTimestamp } from '@/utils/formatDate'
import Image from 'next/image'

import { User } from '@/types/user'
import { Chat } from '@/types/chat'

interface RecentChatsProps {
    chats: Chat[]
    selectedUser: User | null
    setSelectedUser: (user: User | null) => void
}

const RecentChats: React.FC<RecentChatsProps> = ({
    chats,
    selectedUser,
    setSelectedUser,
}) => {
    if (chats.length === 0) return null

    return (
        <div className="px-4 pb-2">
            <h2 className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-3">
                Recent Chats
            </h2>
            <ul className="space-y-1">
                {chats.map((chat) => (
                    <li key={chat.conversationId}>
                        <button
                            onClick={() => {
                                setSelectedUser(chat.partner)
                            }}
                            className={`!bg-white w-full py-2 px-2 rounded-md flex items-center transition-colors ${
                                selectedUser?.username === chat.partner.username
                                    ? 'bg-blue-50'
                                    : 'hover:bg-zinc-100'
                            }`}
                        >
                            <div className="relative flex-shrink-0 w-10 h-10">
                                <Image
                                    src={
                                        chat.partner.avatar ||
                                        'https://via.placeholder.com/50'
                                    }
                                    alt={chat.partner.username}
                                    className="rounded-full object-cover"
                                    fill
                                />
                                {/* Online indicator */}
                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                            </div>

                            <div className="ml-3 flex-1 overflow-hidden text-left">
                                <div className="flex justify-between items-baseline">
                                    <span
                                        className={`font-medium truncate ${
                                            selectedUser?.username ===
                                            chat.partner.username
                                                ? 'text-blue-600'
                                                : 'text-zinc-800'
                                        }`}
                                    >
                                        {chat.partner.username}
                                    </span>
                                    <span className="text-xs text-zinc-400 ml-2 flex-shrink-0">
                                        {formatTimestamp(chat.lastMessageDate)}
                                    </span>
                                </div>
                                <p className="text-sm text-zinc-500 truncate mt-0.5">
                                    {chat.lastMessage.content}
                                </p>
                            </div>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default RecentChats
