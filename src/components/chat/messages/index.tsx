import React from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';

interface ChatSectionProps {
  selectedUser: any;
  setSelectedUser: (user: any | null) => void;
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  messages: any[];
  user: any;
  chatContainerRef: React.RefObject<HTMLDivElement>;
  handleScroll: () => void;
  hasNewMessage: boolean;
  scrollToBottom: () => void;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  sendTyping: () => void;
  sendSeen: () => void;
  isTyping: boolean;
  isSeen: boolean;
  sendMessage: () => void;
  sendPrivateMessage: () => void;
  isLoggedIn: boolean;
}

const ChatSection: React.FC<ChatSectionProps> = ({
  selectedUser,
  setSelectedUser,
  setMessages,
  messages,
  user,
  chatContainerRef,
  handleScroll,
  hasNewMessage,
  scrollToBottom,
  message,
  setMessage,
  sendTyping,
  sendSeen,
  isTyping,
  isSeen,
  sendMessage,
  sendPrivateMessage,
  isLoggedIn
}) => {
  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      <ChatHeader 
        selectedUser={selectedUser} 
        onClose={() => {
          setSelectedUser(null);
          setMessages([]);
        }} 
      />
      
      <MessageList 
        messages={messages}
        selectedUser={selectedUser}
        user={user}
        chatContainerRef={chatContainerRef}
        handleScroll={handleScroll}
        hasNewMessage={hasNewMessage}
        scrollToBottom={scrollToBottom}
      />
      
      <div className="p-4 border-t border-zinc-100">
        <div className="flex flex-col">
          <TypingIndicator isTyping={isTyping} isSeen={isSeen} />
          
          <MessageInput
            message={message}
            setMessage={setMessage}
            sendTyping={sendTyping}
            sendSeen={sendSeen}
            sendMessage={selectedUser ? sendPrivateMessage : sendMessage}
            isDisabled={!selectedUser && !isLoggedIn}
          />
        </div>
      </div>
    </main>
  );
};

export default ChatSection;