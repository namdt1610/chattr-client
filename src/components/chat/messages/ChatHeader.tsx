import React from 'react';

interface ChatHeaderProps {
  selectedUser: any;
  onClose: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ selectedUser, onClose }) => {
  return (
    <div className="h-14 px-6 flex items-center justify-between border-b border-zinc-100">
      {selectedUser ? (
        <>
          <div className="font-medium">{selectedUser.username}</div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-600"
          >
            ×
          </button>
        </>
      ) : (
        <div className="text-zinc-400">Select a user to start chatting</div>
      )}
    </div>
  );
};

export default ChatHeader;