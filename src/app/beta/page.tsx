'use client'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useConsoleLogs } from '@/hooks/useLogs'
import { useLogout } from '@/hooks/useLogout'
import { useSocket } from '@/hooks/useSocket'
import { useChat } from '@/hooks/useChat'
import { useUsers } from '@/hooks/useUsers'
import { useChatStatus } from '@/hooks/useChatStatus'
import { useRecentChats } from '@/hooks/useGetRecentChats'
import ExpiredSessionModal from '@/components/ExpiredSessionModal'
import Sidebar from '@/components/chat/sidebar'
import ChatSection from '@/components/chat/messages'
import { MessageCircle, Wifi, WifiOff } from 'lucide-react'

const Chat = () => {
    const logs = useConsoleLogs()
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
    const { isTyping, isSeen, sendTyping, sendSeen } = useChatStatus({
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

    // Animation variants
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
            <motion.div 
                className={`py-1 px-4 text-xs font-medium flex items-center justify-center gap-1 transition-colors ${
                    isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
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
            </motion.div>

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
                        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
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
                        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
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
                            setSelectedUser(user);
                            setIsMobileSidebarOpen(false); // Close mobile sidebar on selection
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
                        chatContainerRef={chatContainerRef as React.RefObject<HTMLDivElement>}
                        handleScroll={handleScroll}
                        hasNewMessage={hasNewMessage}
                        scrollToBottom={scrollToBottom}
                        message={message}
                        setMessage={setMessage}
                        sendTyping={sendTyping}
                        sendSeen={sendSeen}
                        isTyping={isTyping}
                        isSeen={isSeen}
                        sendMessage={sendMessage}
                        sendPrivateMessage={sendPrivateMessage}
                        isLoggedIn={isLoggedIn}
                    />
                    
                    {/* Welcome/Empty State */}
                    {!selectedUser && (
                        <motion.div 
                            className="absolute inset-0 flex items-center justify-center bg-gray-50/80 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="text-center p-8 max-w-md">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.5, type: 'spring' }}
                                >
                                    <div className="mx-auto bg-indigo-100 rounded-full p-6 w-24 h-24 flex items-center justify-center mb-6">
                                        <MessageCircle size={36} className="text-indigo-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                        Welcome to ChatApp
                                    </h2>
                                    <p className="text-gray-600 mb-6">
                                        {isLoggedIn 
                                            ? "Select a conversation from the sidebar to start chatting" 
                                            : "Please log in to start chatting with other users"}
                                    </p>
                                    {!isLoggedIn && (
                                        <motion.button
                                            onClick={() => setShowLoginModal(true)}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md transition-colors"
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Log in
                                        </motion.button>
                                    )}
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
            
            {/* Overlay for mobile when sidebar is open */}
            {isMobileSidebarOpen && (
                <motion.div 
                    className="md:hidden fixed inset-0 bg-black/50 z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsMobileSidebarOpen(false)}
                />
            )}
        </motion.div>
    )
}

export default Chat