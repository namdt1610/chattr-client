import React from 'react'

import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import TypingIndicator from './TypingIndicator'

import { User } from '@/types/user'
import { Message } from '@/types/message'

interface ChatSectionProps {
    selectedUser: User | null
    setSelectedUser: (user: User | null) => void
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>
    messages: Message[]
    user: User | null
    chatContainerRef: React.RefObject<HTMLDivElement>
    handleScroll: () => void
    hasNewMessage: boolean
    scrollToBottom: () => void
    message: string
    setMessage: React.Dispatch<React.SetStateAction<string>>
    sendTyping: () => void
    sendStopTyping: () => void
    sendSeen: () => void
    isTyping: boolean
    isSeen: boolean
    sendMessage: () => void
    sendPrivateMessage: () => void
    isLoggedIn: boolean
    conversationId?: string | null // Thêm prop này
}

const ChatSection: React.FC<ChatSectionProps> = ({
    selectedUser,
    setSelectedUser,
    setMessages,
    messages,
    user,
    chatContainerRef,
    handleScroll,
    hasNewMessage,
    scrollToBottom,
    message,
    setMessage,
    sendTyping,
    sendStopTyping,
    sendSeen,
    isTyping,
    isSeen,
    sendMessage,
    sendPrivateMessage,
    isLoggedIn,
    conversationId, // Nhận prop này
}) => {
    // Only render when we have a selected user
    if (!selectedUser) {
        return null
    }

    // Điều kiện disable gửi tin nhắn
    const isSendDisabled =
        !selectedUser?._id || !user?._id || !conversationId || !isLoggedIn

    return (
        <main className="flex-1 flex flex-col overflow-hidden h-full">
            <ChatHeader
                selectedUser={selectedUser}
                onClose={() => {
                    setSelectedUser(null)
                    setMessages([])
                }}
            />

            <MessageList
                messages={messages}
                selectedUser={selectedUser}
                user={user}
                chatContainerRef={chatContainerRef}
                handleScroll={handleScroll}
                hasNewMessage={hasNewMessage}
                scrollToBottom={scrollToBottom}
            />

            <div className="p-4 border-t border-zinc-100">
                <div className="flex flex-col">
                    <TypingIndicator isTyping={isTyping} isSeen={isSeen} />

                    <MessageInput
                        message={message}
                        setMessage={setMessage}
                        sendTyping={sendTyping}
                        sendStopTyping={sendStopTyping}
                        sendSeen={sendSeen}
                        sendMessage={
                            selectedUser ? sendPrivateMessage : sendMessage
                        }
                        isDisabled={isSendDisabled}
                    />
                </div>
            </div>
        </main>
    )
}

export default ChatSection
