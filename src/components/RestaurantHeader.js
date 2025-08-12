'use client';
import Link from 'next/link';

export default function RestaurantHeader({ restaurant }) {
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
    <section className="relative z-10 pt-8 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/" className="text-gray-400 hover:text-orange-500 transition mb-4 inline-flex items-center gap-2">
          <span>←</span> Back to Restaurants
        </Link>

        {/* Restaurant Info Card */}
        <div className="glass-dark rounded-2xl p-8 border border-gray-800 mt-4">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Restaurant Image */}
            <div className="w-full md:w-48 h-48 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
              {restaurant.restaurantImage ? (
                <>
                  <img 
                    src={restaurant.restaurantImage} 
                    alt={restaurant.restaurantName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  {/* Fallback */}
                  <div className="absolute w-full h-full hidden items-center justify-center bg-gradient-to-br from-orange-500 to-orange-700">
                    <span className="text-white text-8xl">🍽️</span>
                  </div>
                </>
              ) : (
                <span className="text-white text-8xl">🍽️</span>
              )}
            </div>

            {/* Restaurant Details */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                    {restaurant.restaurantName}
                  </h1>
                  <p className="text-gray-400 mb-2">
                    {restaurant.cuisine?.join(', ') || 'Various'}
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg h-fit">
                  <span className="text-xl">⭐</span>
                  <span className="font-bold text-lg">{restaurant.avgRating.toFixed(1)}</span>
                  <span className="text-sm">({restaurant.reviewCount})</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <span className="text-orange-400 text-lg">💰</span>
                  <span>{getPriceRangeDisplay(restaurant.priceRange)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <span className="text-orange-400 text-lg">🕐</span>
                  <span>{restaurant.estimatedDelivery} min delivery</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <span className={`text-lg ${restaurant.isOpen ? 'text-green-400' : 'text-red-400'}`}>
                    {restaurant.isOpen ? '🟢' : '🔴'}
                  </span>
                  <span>{restaurant.isOpen ? 'Open Now' : 'Closed'}</span>
                </div>
              </div>

              {restaurant.address && (
                <div className="mt-4 flex items-start gap-2 text-gray-400 text-sm">
                  <span className="text-orange-400 text-lg">📍</span>
                  <span>{restaurant.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
