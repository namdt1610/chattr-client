// components/ConnectionStatusBar.tsx
import React from 'react'
import { Wifi, WifiOff } from 'lucide-react'

interface ConnectionStatusBarProps {
    isConnected: boolean
}

const ConnectionStatusBar: React.FC<ConnectionStatusBarProps> = ({
    isConnected,
}) => {
    return (
        <div
            className={`py-1 px-4 text-xs font-medium flex items-center justify-center gap-1 transition-colors ${
                isConnected
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
            }`}
        >
            {isConnected ? (
                <>
                    <Wifi size={12} />
                    <span>Connected to chat server</span>
                </>
            ) : (
                <>
                    <WifiOff size={12} />
                    <span>Disconnected - trying to reconnect...</span>
                </>
            )}
        </div>
    )
}

export default ConnectionStatusBar
