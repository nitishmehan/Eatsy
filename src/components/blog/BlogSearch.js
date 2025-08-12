'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BlogSearch({ initialSearch = '', initialCategory = '' }) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);

  const categories = ['', 'Food Review', 'Recipe', 'Restaurant Experience', 'Tips & Tricks', 'Other'];

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    router.push(`/blogs?${params.toString()}`);
  };

  const handleClear = () => {
    setSearch('');
    setCategory('');
    router.push('/blogs');
  };

  return (
    <div className="glass-dark rounded-xl p-6 border border-gray-800 mb-8">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search blogs..."
            className="px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-white placeholder-gray-400"
          />
          
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-white"
          >
            <option value="" className="bg-[#1a1a1a]">All Categories</option>
            {categories.slice(1).map(cat => (
              <option key={cat} value={cat} className="bg-[#1a1a1a]">{cat}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition font-semibold"
          >
            Search
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="bg-white/10 text-white px-6 py-2 rounded-lg hover:bg-white/20 transition font-medium"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
