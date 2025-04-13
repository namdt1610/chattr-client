'use client'

import { useConsoleLogs } from '@/hooks/useLogs'
import { useLogout } from '@/hooks/useLogout'
import { useSocket } from '@/hooks/useSocket'
import { useChat } from '@/hooks/useChat'
import { useUsers } from '@/hooks/useUsers'
import ConsoleLog from '@/components/ConsoleLog'
import { useChatStatus } from '@/hooks/useChatStatus'

const Chat = () => {
    const logs = useConsoleLogs()
    const { handleLogout } = useLogout()
    const {
        user,
        isLoggedIn,
        searchUser,
        userList,
        selectedUser,
        setSelectedUser,
        handleSearch,
    } = useUsers(null)
    const { socket } = useSocket(user)
    const {
        message,
        setMessage,
        messages,
        sendMessage,
        sendPrivateMessage,
        chatContainerRef,
        handleScroll,
        scrollToBottom,
        hasNewMessage,
        conversationId,
    } = useChat(socket, user, selectedUser)
    const { isTyping, isSeen, sendTyping, sendSeen } = useChatStatus({
        socket,
        conversationId: conversationId,
        userId: user?._id,
    })

    return (
        <div className="bg-zinc-50 text-zinc-800 flex flex-col p-32">
            {/* Hidden developer logs - can be toggled with a key combo in production */}
            <ConsoleLog logs={logs} />
            {/* Header Section */}
            <header className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center">
                <h1 className="text-xl font-normal">Chat</h1>
                {isLoggedIn ? (
                    <button
                        onClick={handleLogout}
                        className="text-sm text-zinc-500 hover:text-zinc-800"
                    >
                        Sign out
                    </button>
                ) : (
                    <a
                        href="/login"
                        className="text-sm text-blue-500 hover:text-blue-600"
                    >
                        Sign in
                    </a>
                )}
            </header>

            <div className="flex h-[calc(100vh-60px)]">
                {/* Sidebar */}
                <aside className="w-72 border-r border-zinc-100 flex flex-col">
                    {/* User info */}
                    <div className="p-4 border-b border-zinc-100">
                        {user?.username ? (
                            <div className="text-sm">
                                <span className="text-zinc-500">
                                    Signed in as{' '}
                                </span>
                                <span className="font-medium">
                                    {user.username}
                                </span>
                            </div>
                        ) : (
                            <div className="text-sm text-zinc-400">
                                Not signed in
                            </div>
                        )}
                    </div>

                    {/* User search */}
                    <div className="p-4">
                        <input
                            className="w-full px-3 py-2 text-sm bg-zinc-100 rounded-md border-none placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            type="text"
                            placeholder="Search users..."
                            value={searchUser}
                            onChange={handleSearch}
                        />
                    </div>

                    {/* User list */}
                    <div className="flex-1 overflow-y-auto">
                        {userList.length > 0 ? (
                            <ul className="px-2">
                                {userList.map((u, idx) => (
                                    <li key={idx}>
                                        <button
                                            onClick={() => setSelectedUser(u)}
                                            className={`w-full text-left px-3 py-2 rounded-md text-sm mb-1 transition-colors ${
                                                selectedUser?.username ===
                                                u.username
                                                    ? 'bg-blue-50 text-blue-600'
                                                    : 'hover:bg-zinc-100'
                                            }`}
                                        >
                                            {u.username}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : searchUser ? (
                            <div className="px-4 py-6 text-center text-zinc-400 text-sm">
                                No users found
                            </div>
                        ) : (
                            <div className="px-4 py-6 text-center text-zinc-400 text-sm">
                                Search for users to chat with
                            </div>
                        )}
                    </div>
                </aside>

                {/* Chat Section */}
                <main className="flex-1 flex flex-col">
                    {/* Chat header */}
                    {selectedUser ? (
                        <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center">
                            <div className="font-medium">
                                {selectedUser.username}
                            </div>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="p-2 text-zinc-400 hover:text-zinc-600"
                            >
                                ×
                            </button>
                        </div>
                    ) : (
                        <div className="px-6 py-4 border-b border-zinc-100 text-zinc-400">
                            Select a user to start chatting
                        </div>
                    )}

                    {/* Chat messages */}
                    <div
                        ref={chatContainerRef}
                        className="flex-1 p-6 overflow-y-auto"
                        onScroll={handleScroll}
                    >
                        {messages.length > 0 ? (
                            messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`mb-4 max-w-[80%] ${
                                        msg.sender?.username === user?.username
                                            ? 'ml-auto'
                                            : 'mr-auto'
                                    }`}
                                >
                                    <div className="text-xs text-zinc-400 mb-1 px-1">
                                        {msg.sender?.username ===
                                        user?.username
                                            ? 'You'
                                            : msg.sender?.username}
                                    </div>
                                    <div
                                        className={`py-2 px-4 rounded-lg ${
                                            msg.sender?.username ===
                                            user?.username
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

                    {/* Message input */}
                    <div className="p-4 border-t border-zinc-100">
                        <div className="flex">
                            <input
                                className="flex-1 px-4 py-3 bg-zinc-100 rounded-l-md focus:outline-none"
                                value={message}
                                onChange={(e) => {
                                    setMessage(e.target.value), sendTyping
                                }}
                                placeholder="Type a message..."
                                disabled={!selectedUser && !isLoggedIn}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault()
                                        selectedUser
                                            ? sendPrivateMessage()
                                            : sendMessage()
                                    }
                                }}
                                onFocus={sendSeen}
                            />
                            {isTyping && <p>🔥 Người kia đang nhập...</p>}
                            {isSeen && <p>✅ Tin nhắn đã xem!</p>}
                            <button
                                className={`px-4 rounded-r-md ${
                                    selectedUser || isLoggedIn
                                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                        : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                                }`}
                                onClick={
                                    selectedUser
                                        ? sendPrivateMessage
                                        : sendMessage
                                }
                                disabled={!selectedUser && !isLoggedIn}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Chat
