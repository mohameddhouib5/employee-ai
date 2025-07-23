import { useState } from 'react';

function Search({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      onSearch(query);
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        className="search-input"
        placeholder="Search with Employee AI..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
      />
    </div>
  );
}

export default Search;