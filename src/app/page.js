import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getFilteredRestaurants } from '@/lib/filters';
import RestaurantCard from '@/components/RestaurantCard';
import FilterBar from '@/components/FilterBar';
import Navbar from '@/components/Navbar';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import SearchBar from '@/components/SearchBar';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export default async function Home(props) {
  const searchParams = await props.searchParams;
  
  // Check if user is logged in and redirect vendors
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  let user = null;
  
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      user = decoded;
      
      // Redirect vendors to their dashboard
      if (decoded.role === 'vendor') {
        redirect('/vendor/dashboard');
      }
    } catch (error) {
      // Invalid token
    }
  }

  const filters = {
    cuisine: searchParams.cuisine,
    priceRange: searchParams.priceRange,
    minRating: searchParams.minRating ? parseFloat(searchParams.minRating) : undefined,
    sortBy: searchParams.sortBy || 'rating',
    sortOrder: searchParams.sortOrder || 'desc',
    search: searchParams.search || '' // Add search parameter
  };

  const restaurants = await getFilteredRestaurants(filters);

  // Serialize restaurant data properly including restaurantImage
  const serializedRestaurants = restaurants.map(restaurant => ({
    ...restaurant,
    _id: restaurant._id.toString(),
    restaurantImage: restaurant.restaurantImage || null
  }));

  return (
    <div className="min-h-screen bg-[#0a0a0a] overflow-x-hidden relative">
      {/* Diagonal Gradient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-orange-500/20 via-orange-600/10 to-transparent blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-orange-600/20 via-orange-500/10 to-transparent blur-3xl"></div>
      </div>

      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative z-10 py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl sm:text-7xl font-bold text-white mb-8 leading-tight">
            Order <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Delicious Food</span> Online
          </h2>
          <p className="text-xl sm:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto">
            Discover amazing restaurants and get your favorite meals delivered right to your doorstep
          </p>
          
          {/* Search Bar */}
          <SearchBar initialSearch={filters.search} />
          
          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link href="/signup" className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-10 py-4 rounded-lg hover:from-orange-600 hover:to-orange-700 transition font-semibold text-lg">
                Get Started
              </Link>
              <Link href="#restaurants" className="glass-dark text-white px-10 py-4 rounded-lg hover:bg-white/10 transition border border-gray-700 font-semibold text-lg">
                Browse Restaurants
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-dark rounded-xl p-8 border border-gray-800 hover:border-orange-500/50 transition">
              <div className="text-5xl mb-4">🍕</div>
              <h3 className="text-2xl font-bold text-white mb-3">Wide Selection</h3>
              <p className="text-gray-400 text-lg">Choose from hundreds of restaurants and cuisines</p>
            </div>

            {/* Feature 2 */}
            <div className="glass-dark rounded-xl p-8 border border-gray-800 hover:border-orange-500/50 transition">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold text-white mb-3">Fast Delivery</h3>
              <p className="text-gray-400 text-lg">Get your food delivered hot and fresh in minutes</p>
            </div>

            {/* Feature 3 */}
            <div className="glass-dark rounded-xl p-8 border border-gray-800 hover:border-orange-500/50 transition">
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="text-2xl font-bold text-white mb-3">Top Rated</h3>
              <p className="text-gray-400 text-lg">Only the best restaurants with verified reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section id="restaurants" className="relative z-10">
        <FilterBar currentFilters={filters} />
      </section>

      {/* Restaurant List */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {/* Search results indicator */}
        {filters.search && (
          <p className="text-gray-400 mb-4">
            Search results for: <span className="text-white font-semibold">"{filters.search}"</span>
          </p>
        )}
        
        {/* Search Bar above cards */}
        <div className="mb-6">
          <SearchBar initialSearch={filters.search} compact={true} />
        </div>
        
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-8">
          {serializedRestaurants.length} Restaurants Available
        </h3>
        
        {serializedRestaurants.length === 0 ? (
          <div className="glass-dark rounded-xl p-12 text-center border border-gray-800">
            <div className="text-6xl mb-4">🍽️</div>
            <p className="text-gray-400 text-lg">
              {filters.search ? 'No restaurants found for your search. Try different keywords.' : 'No restaurants found. Try adjusting your filters.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {serializedRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="glass-dark border-t border-gray-800 py-10 mt-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h4 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-2">
                Eatsy
              </h4>
              <p className="text-gray-400">Delicious food, delivered fast</p>
            </div>
            <div className="flex gap-8 text-gray-400">
              <Link href="/about" className="hover:text-orange-500 transition">About</Link>
              <Link href="/contact" className="hover:text-orange-500 transition">Contact</Link>
              <Link href="/terms" className="hover:text-orange-500 transition">Terms</Link>
              <Link href="/privacy" className="hover:text-orange-500 transition">Privacy</Link>
            </div>
          </div>
          <div className="text-center text-gray-500 text-sm mt-8">
            &copy; 2024 Eatsy. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
