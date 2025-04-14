import React from 'react'
import ConnectionStatus from './ConnectionStatus'
import Link from 'next/link'

interface HeaderProps {
    isLoggedIn: boolean
    isConnected: boolean
    onLogout: () => void
}

const Header: React.FC<HeaderProps> = ({
    isLoggedIn,
    isConnected,
    onLogout,
}) => {
    return (
        <header className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center">
            <h1 className="text-xl font-normal">Chattr</h1>
            <Link
                className="text-sm text-blue-500 hover:text-blue-600"
                href={'/beta'}
            >
                Try my new look!
            </Link>
            <ConnectionStatus isConnected={isConnected} />
            {isLoggedIn ? (
                <button
                    onClick={onLogout}
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
    )
}

export default Header
