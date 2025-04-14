import React from 'react';

interface ConnectionStatusProps {
  isConnected: boolean;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ isConnected }) => {
  return (
    <div
      className={`flex items-center text-xs rounded-full px-2 py-0.5 ${
        isConnected
          ? 'bg-green-100 text-green-800'
          : 'bg-amber-100 text-amber-800'
      }`}
    >
      <div
        className={`w-1.5 h-1.5 rounded-full mr-1 ${
          isConnected ? 'bg-green-500' : 'bg-amber-500'
        }`}
      ></div>
      {isConnected ? 'Connected' : 'Offline'}
    </div>
  );
};

export default ConnectionStatus;