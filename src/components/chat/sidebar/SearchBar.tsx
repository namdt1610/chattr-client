import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="h-16 p-4">
      <input
        className="w-full px-3 py-2 text-sm bg-zinc-100 rounded-md border-none placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
        type="text"
        placeholder="Search users..."
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchBar;