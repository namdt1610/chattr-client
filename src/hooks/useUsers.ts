import { useState, useEffect } from 'react';
import axios from 'axios';
import { Socket } from 'socket.io-client';

export const useUsers = (socket: Socket | null) => {
      const [searchUser, setSearchUser] = useState('');
      const [userList, setUserList] = useState<{ username: string }[]>([]);
      const [selectedUser, setSelectedUser] = useState<string | null>(null);
      const [user, setUser] = useState<{
            userId: string;
            username?: string | null;
      } | null>(null);
      const [isLoggedIn, setIsLoggedIn] = useState(false);

      // Load current user
      useEffect(() => {
            try {
                  axios
                        .get('http://localhost:5050/api/auth/me', {
                              headers: {
                                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                              },
                              withCredentials: true,
                        })
                        .then((res) => {
                              setUser(res.data.user);
                              setIsLoggedIn(true);
                        });
            } catch (error) {
                  setIsLoggedIn(false);
                  console.error('Error fetching user data:', error);
            }
      }, []);

      // Socket user list events
      useEffect(() => {
            if (!socket) return;

            socket.on('user_list', (users) => setUserList(users));

            return () => {
                  socket.off('user_list');
            };
      }, [socket]);

      // Search users
      const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
            const query = e.target.value.trim();
            setSearchUser(query);

            if (query) {
                  try {
                        const response = await axios.get(
                              `http://localhost:5050/api/users/${query}`,
                              {
                                    headers: { 'Content-Type': 'application/json' },
                                    withCredentials: true,
                              }
                        );
                        setUserList(response.data);
                  } catch (error) {
                        console.error('Error fetching users:', error);
                  }
            } else {
                  setUserList([]);
            }
      };

      return {
            searchUser,
            userList,
            selectedUser,
            setSelectedUser,
            user,
            isLoggedIn,
            handleSearch,
      };
};