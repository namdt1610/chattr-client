import React from 'react'

import { User } from '@/types/user'

interface UserListProps {
    userList: User[]
    searchQuery: string
    selectedUser: User | null
    setSelectedUser: (user: User | null) => void
}

const UserList: React.FC<UserListProps> = ({
    userList,
    searchQuery,
    selectedUser,
    setSelectedUser,
}) => {
    if (userList.length === 0) {
        if (searchQuery) {
            return (
                <div className="px-4 py-3 text-center text-zinc-400 text-sm">
                    No users found
                </div>
            )
        }
        return null
    }

    return (
        <div className="px-2 mb-4">
            <h2 className="text-xs font-medium uppercase tracking-wider text-zinc-500 px-2 mb-2">
                Search Results
            </h2>
            <ul>
                {userList.map((user, idx) => (
                    <li key={idx}>
                        <button
                            onClick={() => setSelectedUser(user)}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm mb-1 transition-colors ${
                                selectedUser?.username === user.username
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'hover:bg-zinc-100'
                            }`}
                        >
                            {user.username}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default UserList
