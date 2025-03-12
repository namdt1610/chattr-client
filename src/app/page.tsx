'use client'

import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import axios from 'axios'

const socket = io('http://localhost:5050', {
    withCredentials: true,
    transports: ['websocket'],
    auth: { token: localStorage.getItem('token') },
})

export default function Chat() {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState<
        { from: string; content: string }[]
    >([])
    const [searchUser, setSearchUser] = useState('')
    const [userList, setUserList] = useState<{ username: string }[]>([])
    const [selectedUser, setSelectedUser] = useState<string | null>(null)
    const [user, setUser] = useState<{
        userId: string
        username?: string | null
    } | null>(null)

    useEffect(() => {
        axios
            .get('http://localhost:5050/api/auth/me', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                withCredentials: true,
            })
            .then((res) => setUser(res.data.user))
    }, [])

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Socket connected successfully')
        })

        socket.on('error', (error) => {
            console.error('Socket error:', error)
        })

        socket.on('message', (msg) => {
            setMessages((prev) => [...prev, { from: 'System', content: msg }])
        })

        socket.on('private_message', (msg) => {
            console.log(`Nhận tin nhắn từ ${msg.from}: ${msg.content}`)
            setMessages((prev) => [
                ...prev,
                { from: msg.from, content: msg.content },
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
        setMessages((prev) => [...prev, { from: 'You', content: message }])
        setMessage('')
    }

    const sendPrivateMessage = async () => {
        if (!selectedUser || !message.trim()) return
        console.log(`Gửi tin nhắn đến ${selectedUser}: ${message}`)
        socket.emit('private_message', { to: selectedUser, message })
        setMessages((prev) => [...prev, { from: 'You', content: message }])
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
                    withCredentials: true,
                }
            )
            .then((res) => setMessages(res.data.messages))
    }, [selectedUser, user?.username])

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
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-xl font-bold">Chat</h1>

            <input
                className="border p-2 w-full mt-4"
                type="text"
                placeholder="Tìm kiếm user..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
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

            <div className="border p-2 h-64 overflow-y-auto mt-4">
                {messages.map((msg, idx) => (
                    <div key={idx} className="p-1 border-b">
                        <strong>{msg.from}: </strong> {msg.content}
                    </div>
                ))}
            </div>

            <input
                className="border p-2 w-full mt-2"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Nhập tin nhắn..."
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
