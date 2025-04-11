import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Socket } from 'socket.io-client';

type Message = {
      senderId: { username: string };
      content: string;
};

type User = {
      userId: string;
      username?: string | null;
} | null;

export const useChat = (socket: Socket | null, user: User, selectedUser: string | null) => {
      const [message, setMessage] = useState('');
      const [messages, setMessages] = useState<Message[]>([]);
      const chatContainerRef = useRef<HTMLDivElement>(null);
      const [isAtBottom, setIsAtBottom] = useState(true);
      const [hasNewMessage, setHasNewMessage] = useState(false);

      // Handle scroll behavior
      const handleScroll = () => {
            if (!chatContainerRef.current) return;
            const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
            const isBottom = scrollTop + clientHeight >= scrollHeight - 10;

            setIsAtBottom(isBottom);
            if (isBottom) setHasNewMessage(false);
      };

      const scrollToBottom = () => {
            chatContainerRef.current?.scrollTo({
                  top: chatContainerRef.current.scrollHeight,
                  behavior: 'smooth',
            });
      };

      // Set new message notification
      useEffect(() => {
            if (!isAtBottom) setHasNewMessage(true);
      }, [messages]);

      // Socket message listeners
      useEffect(() => {
            if (!socket) return;

            socket.on('message', (msg) => {
                  setMessages((prev) => [
                        ...prev,
                        { senderId: { username: 'System' }, content: msg },
                  ]);
            });

            socket.on('private_message', (msg) => {
                  console.log(`Nhận tin nhắn từ ${msg.from}: ${msg.content}`);
                  setMessages((prev) => [
                        ...prev,
                        { senderId: { username: msg.from }, content: msg.content },
                  ]);
            });

            return () => {
                  socket.off('message');
                  socket.off('private_message');
            };
      }, [socket]);

      // Load message history
      useEffect(() => {
            if (!selectedUser || !user?.username) return;

            axios
                  .get(
                        `http://localhost:5050/api/messages/history?senderUsername=${user.username}&receiverUsername=${selectedUser}`,
                        {
                              headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                              },
                              withCredentials: true,
                        }
                  )
                  .then((res) => {
                        setMessages(res.data.messages);
                  });
      }, [selectedUser, user?.username]);

      // Send message functions
      const sendMessage = () => {
            if (!message.trim() || !socket) return;

            socket.emit('message', message);
            setMessages((prev) => [
                  ...prev,
                  { senderId: { username: 'You' }, content: message },
            ]);
            setMessage('');
      };

      const sendPrivateMessage = async () => {
            if (!selectedUser || !message.trim() || !socket || !user?.username) return;

            console.log(`Gửi tin nhắn đến ${selectedUser}: ${message}`);
            socket.emit('private_message', { to: selectedUser, message });

            setMessages((prev) => [
                  ...prev,
                  { senderId: { username: 'You' }, content: message },
            ]);
            setMessage('');

            await axios.post(
                  'http://localhost:5050/api/messages/send',
                  {
                        senderUsername: user.username,
                        receiverUsername: selectedUser,
                        content: message,
                  },
                  { withCredentials: true }
            );
      };

      return {
            message,
            setMessage,
            messages,
            sendMessage,
            sendPrivateMessage,
            chatContainerRef,
            handleScroll,
            scrollToBottom,
            hasNewMessage,
      };
};