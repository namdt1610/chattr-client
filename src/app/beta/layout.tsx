'use client'
import ConnectionStatus from '@/components/chat/ConnectionStatus'
import Link from 'next/link'
import { useLogout } from '@/hooks/useLogout'
import { useUsers } from '@/hooks/useUsers'
import { useSocket } from '@/hooks/useSocket'
interface ChatLayoutProps {
    children: React.ReactNode
}

const ChatLayout: React.FC<ChatLayoutProps> = ({ children }) => {
    const { handleLogout } = useLogout()
    const { user, isLoggedIn } = useUsers(null)
    const { isConnected } = useSocket(user)

    return (
        <div className="overflow-hidden h-screen w-screen bg-zinc-50 text-zinc-800 flex flex-col">
            {/* Header Section */}
            <header className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-normal">Chattr</h1>
                    <Link
                        href="/"
                        className="flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                        >
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                        Back to Basic
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <ConnectionStatus isConnected={isConnected} />
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
                </div>
            </header>

            {/* Main Content */}
            <div className="flex h-[calc(100vh-60px)]">{children}</div>
        </div>
    )
}

export default ChatLayout
