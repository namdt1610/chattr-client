'use client'

import { useEffect, useState, useRef } from 'react'
import io from 'socket.io-client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useConsoleLogs } from '@/hooks/useLogs'
import { useLogout } from '@/hooks/useLogout'
import ConsoleLog from '../components/ConsoleLog'

const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null

const socket = io('http://localhost:5050', {
    withCredentials: true,
    transports: ['websocket'],
    auth: { token },
})

const Chat = () => {
    const logs = useConsoleLogs()
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const { handleLogout } = useLogout()
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState<
        {
            senderId: { username: string }
            content: string
        }[]
    >([])
    const router = useRouter()
    // console.log(messages)

    const [searchUser, setSearchUser] = useState('')
    const [userList, setUserList] = useState<{ username: string }[]>([])
    const [onlineUsers, setOnlineUsers] = useState<string[]>([])
    const [selectedUser, setSelectedUser] = useState<string | null>(null)
    const [user, setUser] = useState<{
        userId: string
        username?: string | null
    } | null>(null)

    const chatContainerRef = useRef<HTMLDivElement>(null)
    const [isAtBottom, setIsAtBottom] = useState(true)
    const [hasNewMessage, setHasNewMessage] = useState(false)

    const handleScroll = () => {
        if (!chatContainerRef.current) return
        const { scrollTop, scrollHeight, clientHeight } =
            chatContainerRef.current
        const isBottom = scrollTop + clientHeight >= scrollHeight - 10

        setIsAtBottom(isBottom)
        if (isBottom) setHasNewMessage(false) // Nếu đang ở cuối thì không cần thông báo tin nhắn mới
    }

    useEffect(() => {
        if (!isAtBottom) setHasNewMessage(true)
    }, [messages])

    const scrollToBottom = () => {
        chatContainerRef.current?.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: 'smooth',
        })
    }

    useEffect(() => {
        try {
            axios
                .get('http://localhost:5050/api/auth/me', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            'accessToken'
                        )}`,
                    },
                    withCredentials: true,
                })
                .then((res) => {
                    setUser(res.data.user), setIsLoggedIn(true)
                })
        } catch (error) {
            setIsLoggedIn(false)
            console.error('Error fetching user data:', error)
        }
    }, [])

    useEffect(() => {
        if (!socket) return
        socket.on('connect', () => {
            console.log('Socket connected successfully')
        })

        socket.on('error', (error) => {
            console.error('Socket error:', error)
        })

        socket.on('online-users', (userId, username) => {
            setOnlineUsers((prev) => [...prev, userId])
            console.log('Người dùng online:', userId)
        })

        socket.on('message', (msg) => {
            setMessages((prev) => [
                ...prev,
                { senderId: { username: 'System' }, content: msg },
            ])
        })

        socket.on('private_message', (msg) => {
            console.log(`Nhận tin nhắn từ ${msg.from}: ${msg.content}`)
            setMessages((prev) => [
                ...prev,
                { senderId: { username: msg.from }, content: msg.content },
            ])
        })

        socket.on('user_list', (users) => setUserList(users))

        return () => {
            socket.off('message')
            socket.off('private_message')
            socket.off('user_list')
        }
    }, [])

    const sendMessage = () => {
        if (!message.trim()) return
        socket.emit('message', message)
        setMessages((prev) => [
            ...prev,
            { senderId: { username: 'You' }, content: message },
        ])
        setMessage('')
    }

    const sendPrivateMessage = async () => {
        if (!selectedUser || !message.trim()) return
        console.log(`Gửi tin nhắn đến ${selectedUser}: ${message}`)
        socket.emit('private_message', { to: selectedUser, message })
        setMessages((prev) => [
            ...prev,
            { senderId: { username: 'You' }, content: message },
        ])
        setMessage('')

        await axios.post(
            'http://localhost:5050/api/messages/send',
            {
                senderUsername: user?.username,
                receiverUsername: selectedUser,
                content: message,
            },
            { withCredentials: true }
        )
    }

    useEffect(() => {
        if (!selectedUser || !user?.username) return
        axios
            .get(
                `http://localhost:5050/api/messages/history?senderUsername=${user.username}&receiverUsername=${selectedUser}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem(
                            'accessToken'
                        )}`,
                    },
                    withCredentials: true,
                }
            )
            .then((res) => {
                setMessages(res.data.messages)
            })
    }, [selectedUser, user?.username, messages])

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.trim()
        setSearchUser(query)

        if (query) {
            try {
                const response = await axios.get(
                    `http://localhost:5050/api/users/${query}`,
                    {
                        headers: { 'Content-Type': 'application/json' },
                        withCredentials: true,
                    }
                )
                setUserList(response.data)
            } catch (error) {
                console.error('Error fetching users:', error)
            }
        } else {
            setUserList([])
        }
    }

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
            >
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`p-2 my-1 max-w-[70%] rounded-lg ${
                            msg.senderId.username === user?.username
                                ? 'bg-blue-500 text-white self-end ml-auto' // Tin nhắn của "You" (bên phải)
                                : 'bg-gray-200 text-black self-start' // Tin nhắn của người khác (bên trái)
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

                {/* Nút cuộn xuống (chỉ hiển thị khi có tin nhắn mới) */}
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
                    if (e.key == 'Enter' && !e.shiftKey) {
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
