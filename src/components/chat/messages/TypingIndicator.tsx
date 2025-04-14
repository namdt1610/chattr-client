import React from 'react';

interface TypingIndicatorProps {
  isTyping: boolean;
  isSeen: boolean;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ isTyping, isSeen }) => {
  return (
    <div className="flex mb-1 text-xs text-zinc-500">
      {isTyping && <span className="mr-2">🔥 User is typing...</span>}
      {isSeen && <span>✅ Message seen</span>}
    </div>
  );
};

export default TypingIndicator;