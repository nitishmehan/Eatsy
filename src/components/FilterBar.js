'use client';
import { useRouter, useSearchParams } from 'next/navigation';

export default function FilterBar({ currentFilters }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="relative z-10 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-dark rounded-xl p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">Filter Restaurants</h3>
          <div className="flex flex-wrap gap-3">
            {/* Cuisine Filter */}
            <select 
              className="bg-white/5 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              value={currentFilters.cuisine || ''}
              onChange={(e) => updateFilter('cuisine', e.target.value)}
            >
              <option value="" className="bg-[#1a1a1a]">All Cuisines</option>
              <option value="Italian" className="bg-[#1a1a1a]">Italian</option>
              <option value="Chinese" className="bg-[#1a1a1a]">Chinese</option>
              <option value="Japanese" className="bg-[#1a1a1a]">Japanese</option>
              <option value="Indian" className="bg-[#1a1a1a]">Indian</option>
              <option value="Mexican" className="bg-[#1a1a1a]">Mexican</option>
            </select>

            {/* Price Range Filter */}
            <select 
              className="bg-white/5 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              value={currentFilters.priceRange || ''}
              onChange={(e) => updateFilter('priceRange', e.target.value)}
            >
              <option value="" className="bg-[#1a1a1a]">All Prices</option>
              <option value="under-100" className="bg-[#1a1a1a]">Under ₹100</option>
              <option value="100-300" className="bg-[#1a1a1a]">₹100 - ₹300</option>
              <option value="300-500" className="bg-[#1a1a1a]">₹300 - ₹500</option>
              <option value="500+" className="bg-[#1a1a1a]">₹500+</option>
            </select>

            {/* Rating Filter */}
            <select 
              className="bg-white/5 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              value={currentFilters.minRating || ''}
              onChange={(e) => updateFilter('minRating', e.target.value)}
            >
              <option value="" className="bg-[#1a1a1a]">All Ratings</option>
              <option value="4" className="bg-[#1a1a1a]">4+ Stars</option>
              <option value="3" className="bg-[#1a1a1a]">3+ Stars</option>
              <option value="2" className="bg-[#1a1a1a]">2+ Stars</option>
            </select>

            {/* Sort By */}
            <select 
              className="bg-white/5 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              value={currentFilters.sortBy || 'rating'}
              onChange={(e) => updateFilter('sortBy', e.target.value)}
            >
              <option value="rating" className="bg-[#1a1a1a]">Sort by Rating</option>
              <option value="deliveryTime" className="bg-[#1a1a1a]">Sort by Delivery Time</option>
              <option value="name" className="bg-[#1a1a1a]">Sort by Name</option>
            </select>

            {/* Clear Filters */}
            <button 
              onClick={() => router.push('/')}
              className="text-orange-500 hover:text-orange-400 px-4 py-2 transition font-medium"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
