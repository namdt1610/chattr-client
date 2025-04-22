'use client'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import {
    useChat,
    useChatStatus,
    useUsers,
    useLogout,
    useSocket,
    useRecentChats,
} from '@/hooks'
import Sidebar from '@/components/chat/sidebar'
import ChatSection from '@/components/chat/messages'
import ChatEmptyState from '@/components/chat/ChatEmptyState'
import ExpiredSessionModal from '@/components/ExpiredSessionModal'
import ConnectionStatusBar from '@/components/chat/ConnectionStatusBar'
import MobileSidebarOverlay from '@/components/chat/MobileSidebarOverlay'

const Chat = () => {
    const { handleLogout } = useLogout()

    const {
        user,
        isLoggedIn,
        searchUser,
        userList,
        selectedUser,
        setSelectedUser,
        handleSearch,
    } = useUsers(null)

    const { socket, isConnected } = useSocket(user)

    const {
        message,
        setMessage,
        messages,
        setMessages,
        sendMessage,
        sendPrivateMessage,
        chatContainerRef,
        handleScroll,
        scrollToBottom,
        hasNewMessage,
        conversationId,
    } = useChat(socket, user, selectedUser)

    const { isTyping, isSeen, sendTyping, sendStopTyping, sendSeen } =
        useChatStatus({
            socket,
            conversationId: conversationId,
            userId: user?._id,
        })

    const { chats } = useRecentChats(user?._id || '')
    const [showLoginModal, setShowLoginModal] = useState(!isLoggedIn)
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

    useEffect(() => {
        setShowLoginModal(!isLoggedIn)
    }, [isLoggedIn])

    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
    }

    return (
        <motion.div
            className="flex flex-col bg-gray-50 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Connection Status Bar */}
            <ConnectionStatusBar isConnected={isConnected} />

            {/* Login Modal */}
            <AnimatePresence>
                {showLoginModal && (
                    <ExpiredSessionModal
                        isOpen={showLoginModal}
                        onClose={() => {
                            setShowLoginModal(false)
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Main Chat Area */}
            <div className="flex flex-1 overflow-hidden">
                {/* Mobile Sidebar Toggle Button - only visible on mobile */}
                <div className="md:hidden fixed bottom-4 left-4 z-30">
                    <motion.button
                        onClick={() =>
                            setIsMobileSidebarOpen(!isMobileSidebarOpen)
                        }
                        className="bg-indigo-600 text-white p-3 rounded-full shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <MessageCircle size={24} />
                    </motion.button>
                </div>

                {/* Sidebar */}
                <motion.div
                    className={`bg-white md:relative fixed inset-y-0 left-0 z-20 w-full md:w-80 xl:w-96 border-r border-gray-200 transition-transform ${
                        isMobileSidebarOpen
                            ? 'translate-x-0'
                            : '-translate-x-full md:translate-x-0'
                    }`}
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                >
                    <Sidebar
                        user={user}
                        searchUser={searchUser}
                        handleSearch={handleSearch}
                        userList={userList}
                        selectedUser={selectedUser}
                        setSelectedUser={(user) => {
                            setMessages([])
                            setSelectedUser(user)
                            setIsMobileSidebarOpen(false)
                        }}
                        chats={chats}
                        onLogout={handleLogout}
                    />
                </motion.div>

                {/* Chat Area */}
                <motion.div
                    className="flex-1 relative h-full"
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                >
                    <ChatSection
                        selectedUser={selectedUser}
                        setSelectedUser={setSelectedUser}
                        setMessages={setMessages}
                        messages={messages}
                        user={user}
                        chatContainerRef={
                            chatContainerRef as React.RefObject<HTMLDivElement>
                        }
                        handleScroll={handleScroll}
                        hasNewMessage={hasNewMessage}
                        scrollToBottom={scrollToBottom}
                        message={message}
                        setMessage={setMessage}
                        sendTyping={sendTyping}
                        sendStopTyping={sendStopTyping}
                        sendSeen={sendSeen}
                        isTyping={isTyping}
                        isSeen={isSeen}
                        sendMessage={sendMessage}
                        sendPrivateMessage={sendPrivateMessage}
                        isLoggedIn={isLoggedIn}
                    />

                    {/* Welcome/Empty State */}
                    {!selectedUser && (
                        <ChatEmptyState
                            isLoggedIn={isLoggedIn}
                            setShowLoginModal={setShowLoginModal}
                        />
                    )}
                </motion.div>
            </div>

            <MobileSidebarOverlay
                isMobileSidebarOpen={isMobileSidebarOpen}
                setIsMobileSidebarOpen={setIsMobileSidebarOpen}
            />
        </motion.div>
    )
}

export default Chat
