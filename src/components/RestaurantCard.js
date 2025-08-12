'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function RestaurantCard({ restaurant }) {
  const [imageError, setImageError] = useState(false);

  const getPriceRangeDisplay = (priceRange) => {
    const ranges = {
      'under-100': 'Under ₹100',
      '100-300': '₹100-₹300',
      '300-500': '₹300-₹500',
      '500+': '₹500+'
    };
    return ranges[priceRange] || priceRange;
  };

  return (
    <Link href={`/restaurant/${restaurant._id}`}>
      <div className="glass-dark rounded-xl shadow-lg hover:shadow-2xl hover:shadow-orange-500/20 transition-all cursor-pointer overflow-hidden border border-gray-800 hover:border-orange-500/50 group">
        <div className="h-48 bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center relative overflow-hidden">
          {restaurant.restaurantImage && !imageError ? (
            <img 
              src={restaurant.restaurantImage} 
              alt={restaurant.restaurantName}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition"></div>
              <span className="text-white text-7xl relative z-10">🍽️</span>
            </>
          )}
        </div>
        
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition">
              {restaurant.restaurantName}
            </h3>
            <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-2 py-1 rounded-lg text-sm flex items-center gap-1">
              ⭐ {restaurant.avgRating.toFixed(1)}
            </span>
          </div>
          
          <p className="text-gray-400 text-sm mb-3">
            {restaurant.cuisine?.join(', ') || 'Various'}
          </p>
          
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span className="text-orange-400 font-semibold">
              {getPriceRangeDisplay(restaurant.priceRange)}
            </span>
            <span className="flex items-center gap-1">
              🕐 {restaurant.estimatedDelivery} min
            </span>
          </div>
          
          {!restaurant.isOpen && (
            <div className="mt-3 bg-red-500/20 text-red-400 text-sm px-3 py-2 rounded-lg border border-red-500/30">
              Currently Closed
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
