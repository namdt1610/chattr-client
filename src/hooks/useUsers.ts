'use client'
import { useState, useEffect } from 'react'
import api from '@/services/api'
import { Socket } from 'socket.io-client'
import { User } from '@/types/user'

// Return placeholder values for required fields not provided by the API
const mapToUser = (apiUser: {
    _id: string
    username?: string | null
}): User => ({
    _id: apiUser._id,
    username: apiUser.username || '',
    email: '', // Placeholder
    avatar: '', // Placeholder
    createdAt: '', // Placeholder
    updatedAt: '', // Placeholder
})

export const useUsers = (socket: Socket | null) => {
    const [isSessionExpired, setIsSessionExpired] = useState(false)
    const [searchUser, setSearchUser] = useState('')
    const [userList, setUserList] = useState<User[]>([])
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    // Load current user
    useEffect(() => {
        try {
            api.get('http://localhost:5050/api/auth/me', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                        'accessToken'
                    )}`,
                },
                withCredentials: true,
            }).then((res) => {
                if (res.status == 401) {
                    window.location.href = '/login'
                }
                console.log('Current user:', res.data.user)
                setUser(res.data.user ? mapToUser(res.data.user) : null)
                setIsSessionExpired(false)
                setIsLoggedIn(true)
            })
        } catch (error) {
            setIsLoggedIn(false)
            setIsSessionExpired(true)
            console.error('Error fetching user data:', error)
        }
    }, [])

    // Socket user list events
    useEffect(() => {
        if (!socket) return

        socket.on('user_list', (users) => {
            setUserList(users.map(mapToUser))
        })

        return () => {
            socket.off('user_list')
        }
    }, [socket])

    // Search users
    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.trim()
        setSearchUser(query)

        if (query) {
            try {
                const response = await api.get(
                    `http://localhost:5050/api/users/${query}`,
                    {
                        headers: { 'Content-Type': 'application/json' },
                        withCredentials: true,
                    }
                )
                setUserList(response.data.map(mapToUser))
                console.log(response.data)
            } catch (error) {
                console.error('Error fetching users:', error)
            }
        } else {
            setUserList([])
        }
    }

    return {
        searchUser,
        userList,
        selectedUser,
        setSelectedUser: (u: User | null) => setSelectedUser(u),
        user,
        isLoggedIn,
        handleSearch,
        isSessionExpired,
        setIsSessionExpired,
    }
}
