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
            key={selectedUser?._id || 'no-user'}
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

                        {msg.attachments && msg.attachments.length > 0 ? (
                            <div className="message-attachments gap-2 flex flex-col">
                                {msg.attachments.map(
                                    (fileUrl: string, index: number) => {
                                        const isImage =
                                            /\.(jpg|jpeg|png|gif|webp)$/i.test(
                                                fileUrl
                                            )
                                        return isImage ? (
                                            <img
                                                src={`http://localhost:5050/${fileUrl}`}
                                                crossOrigin="anonymous"
                                                alt={`attachment-${index}`}
                                                key={index}
                                                className="rounded-xl max-w-full h-auto shadow-md"
                                            />
                                        ) : (
                                            <a
                                                href={`http://localhost:5050/${fileUrl}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                key={index}
                                                className="inline-block text-blue-600 hover:underline"
                                            >
                                                📎 File {index + 1}
                                            </a>
                                        )
                                    }
                                )}
                            </div>
                        ) : (
                            <div
                                className={`py-2 px-4 rounded-lg ${
                                    msg.sender?.username === user?.username
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-zinc-100 text-zinc-800'
                                }`}
                            >
                                {msg.content && (
                                    <p className="message-text">
                                        {msg.content}
                                    </p>
                                )}
                            </div>
                        )}
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
