import React from 'react';

interface UserInfoProps {
  username?: string | null;
}

const UserInfo: React.FC<UserInfoProps> = ({ username }) => {
  return (
    <div className="h-14 p-4 border-b border-zinc-100">
      {username ? (
        <div className="text-sm">
          <span className="text-zinc-500">Signed in as </span>
          <span className="font-medium">{username}</span>
        </div>
      ) : (
        <div className="text-sm text-zinc-400">Not signed in</div>
      )}
    </div>
  );
};

export default UserInfo;