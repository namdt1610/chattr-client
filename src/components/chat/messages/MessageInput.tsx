import React from 'react';

interface MessageInputProps {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  sendTyping: () => void;
  sendSeen: () => void;
  sendMessage: () => void;
  isDisabled: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  message,
  setMessage,
  sendTyping,
  sendSeen,
  sendMessage,
  isDisabled
}) => {
  return (
    <div className="flex">
      <input
        className="flex-1 px-4 py-2 bg-zinc-100 rounded-l-md focus:outline-none"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value); 
          sendTyping();
        }}
        placeholder="Type a message..."
        disabled={isDisabled}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
          }
        }}
        onFocus={sendSeen}
      />
      <button
        className={`px-4 rounded-r-md ${
          !isDisabled
            ? 'bg-blue-500 hover:bg-blue-600 text-white'
            : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
        }`}
        onClick={sendMessage}
        disabled={isDisabled}
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;