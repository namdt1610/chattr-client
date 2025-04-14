import React from 'react';
import UserInfo from './UserInfo';
import SearchBar from './SearchBar';
import UserList from './UserList';
import RecentChats from './RecentChats';

export interface SidebarProps {
  user: any;
  searchUser: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  userList: any[];
  selectedUser: any;
  setSelectedUser: (user: any) => void;
  chats: any[];
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  user,
  searchUser,
  handleSearch,
  userList,
  selectedUser,
  setSelectedUser,
  chats
}) => {
  return (
    <aside className="w-72 border-r border-zinc-100 flex flex-col">
      <UserInfo username={user?.username} />
      <SearchBar value={searchUser} onChange={handleSearch} />
      
      <div className="flex-1 overflow-y-auto">
        {userList.length > 0 && (
          <UserList 
            userList={userList} 
            searchQuery={searchUser} 
            selectedUser={selectedUser} 
            setSelectedUser={setSelectedUser} 
          />
        )}
        
        <RecentChats 
          chats={chats} 
          selectedUser={selectedUser} 
          setSelectedUser={setSelectedUser} 
        />
      </div>
    </aside>
  );
};

export default Sidebar;