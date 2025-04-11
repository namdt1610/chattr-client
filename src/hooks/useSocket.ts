import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

export const useSocket = (user: { userId: string; username?: string | null } | null) => {
      const [socket, setSocket] = useState<Socket | null>(null);
      const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

      useEffect(() => {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

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
                  console.error('Socket error:', error);
            });

            socketInstance.on('online-users', (userId, username) => {
                  setOnlineUsers((prev) => [...prev, userId]);
                  console.log('Người dùng online:', userId);
            });

            return () => {
                  socketInstance.disconnect();
            };
      }, []);

      return { socket, onlineUsers };
};
