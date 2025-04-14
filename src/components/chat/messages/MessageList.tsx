import React from 'react'

interface MessageListProps {
    messages: any[]
    selectedUser: any
    user: any
    chatContainerRef: React.RefObject<HTMLDivElement>
    handleScroll: () => void
    hasNewMessage: boolean
    scrollToBottom: () => void
}

const MessageList: React.FC<MessageListProps> = ({
    messages,
    selectedUser,
    user,
    chatContainerRef,
    handleScroll,
    hasNewMessage,
    scrollToBottom,
}) => {
    return (
        <div
            ref={chatContainerRef}
            className="flex-1 p-6 overflow-y-auto"
            onScroll={handleScroll}
        >
            {messages.length > 0 ? (
                messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`w-fit mb-4 max-w-[80%] ${
                            msg.sender?.username === user?.username
                                ? 'ml-auto'
                                : 'mr-auto'
                        }`}
                    >
                        <div className="text-xs text-zinc-400 mb-1 px-1">
                            {msg.sender?.username === user?.username
                                ? 'You'
                                : msg.sender?.username}
                        </div>
                        <div
                            className={`py-2 px-4 rounded-lg ${
                                msg.sender?.username === user?.username
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-zinc-100 text-zinc-800'
                            }`}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))
            ) : selectedUser ? (
                <div className="h-full flex items-center justify-center text-zinc-400 text-sm">
                    No messages yet
                </div>
            ) : (
                <div className="h-full flex items-center justify-center text-zinc-400 text-sm">
                    Select a user to start chatting
                </div>
            )}

            {hasNewMessage && (
                <button
                    onClick={scrollToBottom}
                    className="fixed bottom-24 right-6 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-md"
                >
                    ↓
                </button>
            )}
        </div>
    )
}

export default MessageList
