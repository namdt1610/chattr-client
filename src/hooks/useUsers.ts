'use client'
import { useState, useEffect } from 'react'
import { Socket } from 'socket.io-client'
import { User } from '@/types/user'
import { useAPI } from './useSWRHook'
import { buildApiUrl } from '@/utils/apiConfig'

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

interface SearchUsersResponse {
    [key: number]: {
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
        buildApiUrl('/api/auth/me'),
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

    // Hook to search users with useAPI instead of direct API call
    const { data: searchResults, mutate: refreshSearch } =
        useAPI<SearchUsersResponse>(
            searchUser ? buildApiUrl(`/api/users/${searchUser}`) : null,
            {
                revalidateOnFocus: false,
            }
        )

    // Update userList when search results change
    useEffect(() => {
        if (searchResults) {
            const users = Object.values(searchResults).map(mapToUser)
            setUserList(users)
        }
    }, [searchResults])

    // Search users
    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.trim()
        setSearchUser(query)

        if (!query) {
            setUserList([])
        } else {
            refreshSearch()
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
