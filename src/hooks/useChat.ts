import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Socket } from 'socket.io-client';

type Message = {
      sender: { username: string };
      content: string;
};

type User = {
      _id: string;
      username?: string | null;
} | null;

type SelectedUser = {
      _id: string;
      username?: string | null;
} | null;

export const useChat = (socket: Socket | null, user: User, selectedUser: SelectedUser) => {
      const [message, setMessage] = useState('');
      const [messages, setMessages] = useState<Message[]>([]);
      const chatContainerRef = useRef<HTMLDivElement>(null);
      const [isAtBottom, setIsAtBottom] = useState(true);
      const [hasNewMessage, setHasNewMessage] = useState(false);
      const [conversationId, setConversationId] = useState<string | null>(null);

      // Join room (conversation) on socket connection
      useEffect(() => {
            if (!socket || !user?._id || !selectedUser?._id) {
                  console.log('Socket or user information is missing!');
                  console.log('user:', user, 'selectedUser:', selectedUser);
                  return;
            };

            // Emitting to join room based on conversationId
            const conversationId = [user._id, selectedUser._id].sort().join('_');
            setConversationId(conversationId);

            socket.emit('chat:join_room', conversationId);
            console.log(`🚪 User ${user._id} joined room: ${conversationId}`);

            return () => {
                  socket.emit('chat:leave_room', conversationId); // Xử lý rời room khi component unmount
            };
      }, [socket, user, selectedUser]);


      useEffect(() => {
            if (!selectedUser) {
                  console.log('No user selected!');
                  return; // Không thực hiện gì nếu không có selectedUser
            }

            console.log('Selected user:', selectedUser);
            // Thực hiện các thao tác khi có selectedUser
      }, [selectedUser]);


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
            if (isAtBottom) {
                  scrollToBottom();
            }
      }, [messages]);

      // Socket message listeners
      useEffect(() => {
            if (!socket) return;

            const handleMessage = (msg: any) => {
                  setMessages((prev) => [
                        ...prev,
                        { sender: { username: 'System' }, content: msg },
                  ]);
            };

            const handlePrivateMessage = (msg: any) => {
                  console.log(`Nhận tin nhắn từ ${msg.from}: ${msg.message}`);
                  setMessages((prev) => [
                        ...prev,
                        { sender: { username: msg.from }, content: msg.message },
                  ]);
                  setMessage('');
            };

            socket.on('chat:message', handleMessage);
            socket.on('chat:private_message', handlePrivateMessage);

            return () => {
                  socket.off('chat:message', handleMessage);
                  socket.off('chat:private_message', handlePrivateMessage);
            };
      }, [socket]);


      // Load message history
      useEffect(() => {
            console.log('Loading message history...');
            if (!selectedUser?._id || !user?._id) {
                  console.log('Missing selectedUser or user information!');
                  console.log('Details:', 'selectedUser:', selectedUser, 'user:', user);
                  return;
            }

            axios
                  .get(
                        // `http://localhost:5050/api/messages/history?senderUsername=${user.username}&receiverUsername=${selectedUser.username}`,
                        `http://localhost:5050/api/messages/history?conversationId=${conversationId}`,
                        {
                              headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                              },
                              withCredentials: true,
                        }
                  )
                  .then((res) => {
                        console.log('Message history:', res.data.messages);
                        setMessages(res.data.messages);
                        setTimeout(() => {
                              scrollToBottom();
                        }, 100);
                  });
      }, [selectedUser?._id, conversationId, user?.username]);

      // Send message functions
      const sendMessage = () => {
            if (!message.trim() || !socket) return;

            socket.emit('chat:message', message);

            setMessages((prev) => [
                  ...prev,
                  { sender: { username: 'You' }, content: message },
            ]);
            setMessage('');
      };

      const sendPrivateMessage = async () => {
            if (!selectedUser?._id || !message.trim() || !socket || !user?.username) {
                  console.log('Missing required information to send message!');
                  console.log('selectedUser:', selectedUser, 'message:', message, 'user:', user);
                  return;
            }

            console.log(`Gửi tin nhắn đến ${selectedUser?.username}: ${message}`);
            socket.emit('chat:private_message', { conversationId, receiver: selectedUser, message });

            try {
                  const response = await axios.post(
                        'http://localhost:5050/api/messages/send',
                        {
                              selectedUserId: selectedUser._id,
                              content: message,
                        },
                        {
                              headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                              },
                              withCredentials: true,
                        }
                  );
                  console.log('Message sent successfully:', response.data);
            }
            catch (error) {
                  console.error('Error sending message:', error);
                  // Handle error (e.g., show notification)
            }

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
            conversationId,
      };
};