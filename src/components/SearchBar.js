'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar({ initialSearch = '', compact = false }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  // Debounce search to avoid too many redirects while typing
  useEffect(() => {
    if (searchQuery === initialSearch) return;
    
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        // Don't redirect on every keystroke
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, initialSearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/');
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    router.push('/');
  };

  if (compact) {
    return (
      <form onSubmit={handleSearch}>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search restaurants, cuisines..."
            className="w-full px-5 py-3 pr-28 bg-white/10 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-white placeholder-gray-400 backdrop-blur-sm"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
            {searchQuery && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-1 text-gray-400 hover:text-white transition text-sm"
              >
                Clear
              </button>
            )}
            <button
              type="submit"
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-1 rounded-lg hover:from-orange-600 hover:to-orange-700 transition font-semibold text-sm"
            >
              Search
            </button>
          </div>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for restaurants, cuisines..."
          className="w-full px-6 py-4 pr-32 bg-white/10 border border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-white placeholder-gray-400 text-lg backdrop-blur-sm"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 text-gray-400 hover:text-white transition text-sm"
            >
              Clear
            </button>
          )}
          <button
            type="submit"
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition font-semibold"
          >
            Search
          </button>
        </div>
      </div>
      <p className="text-gray-500 text-sm mt-2">
        Try: "Italian", "Pizza", "Sushi", "Burger"
      </p>
    </form>
  );
}
