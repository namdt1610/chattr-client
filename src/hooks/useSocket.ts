import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

export const useSocket = (user: { _id: string; username?: string | null } | null) => {
      const [socket, setSocket] = useState<Socket | null>(null);
      const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
      const [isConnected, setIsConnected] = useState(false);

      useEffect(() => {
            const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

            const socketInstance = io('http://localhost:5050', {
                  withCredentials: true,
                  transports: ['websocket'],
                  auth: { token },
            });

            setSocket(socketInstance);

            socketInstance.on('connect', () => {
                  console.log('Socket connected successfully');
            });

            socketInstance.on('error', (error) => {
                  setIsConnected(false);
                  console.error('Socket error:', error);
            });

            socketInstance.on('online-users', (userId, username) => {
                  setOnlineUsers((prev) => [...prev, userId]);
                  console.log('Online users:', userId);
            });

            return () => {
                  socketInstance.disconnect();
            };
      }, []);

      return { socket, onlineUsers, isConnected };
};
