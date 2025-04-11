'use client'

import { useConsoleLogs } from '@/hooks/useLogs'
import { useLogout } from '@/hooks/useLogout'
import { useSocket } from '@/hooks/useSocket'
import { useChat } from '@/hooks/useChat'
import { useUsers } from '@/hooks/useUsers'
import ConsoleLog from '@/components/ConsoleLog'

const Chat = () => {
    const logs = useConsoleLogs()
    const { handleLogout } = useLogout()

    // Initialize hooks
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
    } = useChat(socket, user, selectedUser)

    return (
        <div className="p-4 max-w-md w-full mx-auto">
            <h1 className="text-2xl font-bold">Chat App</h1>
            {/* Logs Sections */}
            <ConsoleLog logs={logs} />

            {isLoggedIn ? (
                <div className="flex justify-between items-center">
                    <span className="text-green-700">
                        Đã đăng nhập thành công!
                    </span>
                    <button onClick={handleLogout}>Đăng xuất</button>
                </div>
            ) : (
                <>
                    <div className="text-red-500">
                        Chưa đăng nhập! Vui lòng đăng nhập để sử dụng chat.
                    </div>
                    <button>
                        <a href="/login">Login</a>
                    </button>
                </>
            )}

            {/* Search Sections */}
            <input
                className="border p-2 w-full mt-4"
                type="text"
                placeholder="Tìm kiếm user..."
                value={searchUser}
                onChange={handleSearch}
            />
            <ul className="mt-2">
                {userList.map((u, idx) => (
                    <li key={idx} className="p-1 border-b">
                        <button
                            onClick={() => setSelectedUser(u.username)}
                            className="text-blue-500"
                        >
                            Chat với {u.username}
                        </button>
                    </li>
                ))}
            </ul>

            <div className="mt-4">
                <strong>Bạn: </strong> {user?.username}
            </div>
            <div className="mt-4">
                <strong>Đang chat với: </strong> {selectedUser || 'Chưa chọn'}
                {selectedUser && (
                    <button
                        onClick={() => setSelectedUser(null)}
                        className="text-red-500 ml-2"
                    >
                        Xóa
                    </button>
                )}
            </div>

            {/* Khung chat */}
            <div
                ref={chatContainerRef}
                className="border p-2 h-64 overflow-y-auto mt-4"
                onScroll={handleScroll}
            >
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`p-2 my-1 max-w-[70%] rounded-lg ${
                            msg.senderId.username === user?.username
                                ? 'bg-blue-500 text-white self-end ml-auto'
                                : 'bg-gray-200 text-black self-start'
                        }`}
                        style={{ display: 'flex', flexDirection: 'column' }}
                    >
                        <strong>
                            {msg.senderId.username === user?.username
                                ? 'You'
                                : msg.senderId.username}
                        </strong>
                        <span>{msg.content}</span>
                    </div>
                ))}

                {hasNewMessage && (
                    <button
                        onClick={scrollToBottom}
                        className="fixed bottom-5 right-5 bg-blue-500 text-white px-3 py-2 rounded-full shadow-lg"
                    >
                        🔽 Tin nhắn mới
                    </button>
                )}
            </div>

            <input
                className="border p-2 w-full mt-2"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Nhập tin nhắn..."
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        selectedUser ? sendPrivateMessage() : sendMessage()
                    }
                }}
            />
            <button
                className="bg-blue-500 text-white p-2 mt-2 w-full"
                onClick={selectedUser ? sendPrivateMessage : sendMessage}
            >
                Gửi
            </button>
        </div>
    )
}

export default Chat
