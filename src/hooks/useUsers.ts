'use client'
import { useState, useEffect } from 'react'
import api from '@/services/api'
import { Socket } from 'socket.io-client'
import { User } from '@/types/user'
import { useAPI } from './useSWRHook'

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

interface UserData {
    user: {
        _id: string
        username: string | null
    }
}

export const useUsers = (socket: Socket | null) => {
    const [isSessionExpired, setIsSessionExpired] = useState(false)
    const [searchUser, setSearchUser] = useState('')
    const [userList, setUserList] = useState<User[]>([])
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    // Using SWR to fetch current user data
    const { data: userData, mutate: refreshUser } = useAPI<UserData>(
        '/api/auth/me',
        {
            onSuccess: (data: UserData) => {
                setIsSessionExpired(false)
                setIsLoggedIn(!!data?.user)
            },
            onError: () => {
                setIsLoggedIn(false)
                setIsSessionExpired(true)
                // Redirect to login if unauthenticated
                if (typeof window !== 'undefined') {
                    window.location.href = '/login'
                }
            },
        }
    )

    // Map the user data from SWR response
    const user = userData?.user ? mapToUser(userData.user) : null

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
                const response = await api.get(`/api/users/${query}`, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                })
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
        refreshUser, // Expose function to manually refresh user data
    }
}
