import { useState, useEffect } from 'react';
import axios from 'axios';
import { Socket } from 'socket.io-client';

export const useUsers = (socket: Socket | null) => {
      const [isSessionExpired, setIsSessionExpired] = useState(false)
      const [searchUser, setSearchUser] = useState('');
      const [userList, setUserList] = useState<{ _id: string, username?: string | null }[]>([]);
      const [selectedUser, setSelectedUser] = useState<{
            _id: string;
            username?: string | null;
      } | null>(null);
      const [user, setUser] = useState<{
            _id: string;
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
                              if (res.status == 401) {
                                    window.location.href = '/login';
                              }
                              console.log('Current user:', res.data.user);
                              setUser(res.data.user);
                              setIsSessionExpired(false);
                              setIsLoggedIn(true);
                        });
            } catch (error) {
                  setIsLoggedIn(false);
                  setIsSessionExpired(true);
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
                        console.log(response.data);
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
            isSessionExpired,
            setIsSessionExpired,
      };
};