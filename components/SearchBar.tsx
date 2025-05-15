// components/SearchBar.tsx
import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch(e.target.value); // Trigger the search with the current value
  };

  return (
    <div className="flex justify-center mb-4">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        className="border rounded-md p-2"
        placeholder="Search for posts"
      />
    </div>
  );
};
