import { useState } from 'react';
import { Button, TextField } from '@mui/material';

interface SearchBarProps {
  onSearch: (term: string) => Promise<void>;
  onClear: () => Promise<void>;
  placeholder?: string;
}

const SearchBar = ({ onSearch, onClear, placeholder = "Search..." }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async () => {
    await onSearch(searchTerm.trim());
  };

  const handleClear = async () => {
    setSearchTerm('');
    await onClear();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="mb-6 flex gap-2">
      <TextField
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="flex-1"
        onKeyPress={handleKeyPress}
      />
      <Button variant="contained" onClick={handleSearch}>
        Search
      </Button>
      <Button variant="outlined" onClick={handleClear}>
        Clear
      </Button>
    </div>
  );
};

export default SearchBar;