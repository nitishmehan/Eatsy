'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MenuSearchBar({ restaurantId, initialSearch = '' }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/restaurant/${restaurantId}?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push(`/restaurant/${restaurantId}`);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    router.push(`/restaurant/${restaurantId}`);
  };

  return (
    <form onSubmit={handleSearch} className="mb-6">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search menu items..."
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
