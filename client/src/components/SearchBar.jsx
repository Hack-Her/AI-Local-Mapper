import React, { useState } from 'react';
import { Search, MapPin, Sparkles, Navigation } from 'lucide-react';

const SearchBar = ({ onSearch, initialQuery = '', onUseLocation, isLocating }) => {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="relative flex flex-col md:flex-row items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex-1 flex items-center w-full px-3 py-2 space-x-3">
          <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try: Find a quiet cafe with Wi-Fi where I can work for 4 hours"
            className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none text-sm md:text-base"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto shrink-0">
          <button
            type="button"
            onClick={onUseLocation}
            disabled={isLocating}
            className="flex-1 md:flex-none flex items-center justify-center space-x-1.5 px-3 py-2.5 text-xs font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors"
          >
            <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-blue-500' : ''}`} />
            <span>{isLocating ? 'Locating...' : 'Use My Location'}</span>
          </button>

          <button
            type="submit"
            className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-md transition-all transform active:scale-95"
          >
            <Search className="w-4 h-4" />
            <span>Find Places</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
