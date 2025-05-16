import { User } from '@/types/user'

interface ChatHeaderProps {
    selectedUser: User | null
    onClose: () => void
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ selectedUser, onClose }) => {
    return (
        <div className="h-14 px-6 flex items-center justify-between border-b border-zinc-100">
            {selectedUser ? (
                <>
                    <div className="font-medium">{selectedUser.username}</div>
                    <button
                        onClick={onClose}
                        className="!px-4 text-zinc-400 hover:text-zinc-600"
                    >
                        ×
                    </button>
                </>
            ) : (
                <div className="text-zinc-400">
                    Select a user to start chatting
                </div>
            )}
        </div>
    )
}

export default ChatHeader
