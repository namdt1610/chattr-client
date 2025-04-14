import { useState, useEffect } from 'react';
import axios from 'axios';

interface Chat {
      conversationId: string;
      partner: {
            _id: string;
            username: string;
            avatar: string;
      };
      lastMessage: string;
      createdAt: string;
}

export const useRecentChats = (userId: string) => {
      const [chats, setChats] = useState<Chat[]>([]);
      const [loading, setLoading] = useState<boolean>(false);
      const [error, setError] = useState<string | null>(null);

      useEffect(() => {
            const fetchChats = async () => {
                  setLoading(true);
                  try {
                        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/messages/recent-chats/${userId}`,
                              {
                                    headers: {
                                          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                                    },
                              }
                        );
                        setChats(response.data);
                  } catch (err: any) {
                        setError('Error fetching chats');
                  } finally {
                        setLoading(false);
                  }
            };

            fetchChats();
      }, [userId]); // Chạy lại khi userId thay đổi

      return { chats, loading, error };
};
