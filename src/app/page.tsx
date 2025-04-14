'use client'
import React, { useEffect, useState } from 'react'
import { useConsoleLogs } from '@/hooks/useLogs'
import { useLogout } from '@/hooks/useLogout'
import { useSocket } from '@/hooks/useSocket'
import { useChat } from '@/hooks/useChat'
import { useUsers } from '@/hooks/useUsers'
import ConsoleLog from '@/components/ConsoleLog'
import { useChatStatus } from '@/hooks/useChatStatus'
import { useRecentChats } from '@/hooks/useGetRecentChats'
import { formatTimestamp } from '@/utils/formatDate'
import ExpiredSessionModal from '@/components/ExpiredSessionModal'

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
    const { socket, isConnected } = useSocket(user)
    const {
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
    } = useChat(socket, user, selectedUser)
    const { isTyping, isSeen, sendTyping, sendSeen } = useChatStatus({
        socket,
        conversationId: conversationId,
        userId: user?._id,
    })
    const { chats } = useRecentChats(user?._id || '')
    const [showLoginModal, setShowLoginModal] = useState(!isLoggedIn)

    // Add an effect to update the modal state when login state changes
    useEffect(() => {
        setShowLoginModal(
            !isLoggedIn 
        )
    }, [isLoggedIn])

    return (
        <div className="overflow-hidden h-screen w-screen bg-zinc-50 text-zinc-800 flex flex-col">
            <ExpiredSessionModal
                isOpen={showLoginModal}
                onClose={() => {
                    setShowLoginModal(false)
                }}
            />

            {/* Header Section */}
            <header className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center">
                <h1 className="text-xl font-normal">Chat</h1>
                <div
                    className={`flex items-center text-xs rounded-full px-2 py-0.5 ${
                        isConnected
                            ? 'bg-green-100 text-green-800'
                            : 'bg-amber-100 text-amber-800'
                    }`}
                >
                    <div
                        className={`w-1.5 h-1.5 rounded-full mr-1 ${
                            isConnected ? 'bg-green-500' : 'bg-amber-500'
                        }`}
                    ></div>
                    {isConnected ? 'Connected' : 'Offline'}
                </div>
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
                        {/* Recently chats */}
                        <div className="mt-6 px-4 pb-2">
                            <h2 className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-3">
                                Recent Chats
                            </h2>
                            <ul className="space-y-1">
                                {chats.map((chat) => (
                                    <li key={chat.conversationId}>
                                        <button
                                            onClick={() =>
                                                setSelectedUser(chat.partner)
                                            }
                                            className={`w-full py-2 px-2 rounded-md flex items-center transition-colors ${
                                                selectedUser?.username ===
                                                chat.partner.username
                                                    ? 'bg-blue-50'
                                                    : 'hover:bg-zinc-100'
                                            }`}
                                        >
                                            <div className="relative flex-shrink-0">
                                                <img
                                                    src={
                                                        chat.partner.avatar ||
                                                        'https://via.placeholder.com/50'
                                                    }
                                                    alt={chat.partner.username}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                                {/* Online indicator */}
                                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                                            </div>

                                            <div className="ml-3 flex-1 overflow-hidden text-left">
                                                <div className="flex justify-between items-baseline">
                                                    <span
                                                        className={`font-medium truncate ${
                                                            selectedUser?.username ===
                                                            chat.partner
                                                                .username
                                                                ? 'text-blue-600'
                                                                : 'text-white'
                                                        }`}
                                                    >
                                                        {chat.partner.username}
                                                    </span>
                                                    <span className="text-xs text-zinc-400 ml-2 flex-shrink-0">
                                                        {formatTimestamp(
                                                            chat.createdAt
                                                        )}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-white truncate mt-0.5">
                                                    {chat.lastMessage}
                                                </p>
                                            </div>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </aside>

                {/* Chat Section */}
                <main className="overflow-hidden flex-1 flex flex-col w-full h-full">
                    {/* Chat header */}
                    {selectedUser ? (
                        <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center ">
                            <div className="font-medium">
                                {selectedUser.username}
                            </div>
                            <button
                                onClick={() => {
                                    setSelectedUser(null)
                                    setMessages([])
                                }}
                                className="hover:text-zinc-600 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
                            >
                                x
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
                        className="flex-1 overflow-y-auto p-4 h-0 min-h-0 max-h-[calc(100%-124px)]"
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
                        <div className="flex flex-col">
                            <div className="flex mb-1 text-xs text-zinc-500">
                                {isTyping && (
                                    <span className="mr-2">
                                        🔥 User is typing...
                                    </span>
                                )}
                                {isSeen && <span>✅ Message seen</span>}
                            </div>
                            <div className="flex">
                                <input
                                    className="flex-1 px-4 py-3 bg-zinc-100 rounded-l-md focus:outline-none"
                                    value={message}
                                    onChange={(e) => {
                                        setMessage(e.target.value), sendTyping()
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
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Chat
