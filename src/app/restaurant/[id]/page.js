import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import MenuItem from '@/models/MenuItem';
import Review from '@/models/Review';
import Navbar from '@/components/Navbar';
import MenuItemCard from '@/components/MenuItemCard';
import RestaurantHeader from '@/components/RestaurantHeader';
import Cart from '@/components/Cart';
import MenuSearchBar from '@/components/MenuSearchBar';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function generateMetadata({ params }) {
  const { id } = await params;
  await dbConnect();
  const restaurant = await User.findById(id).lean();
  
  return {
    title: restaurant ? `${restaurant.restaurantName} - Eatsy` : 'Restaurant - Eatsy',
    description: restaurant?.cuisine?.join(', ') || 'Order delicious food online'
  };
}

export default async function RestaurantPage({ params, searchParams }) {
  // Check if user is vendor and redirect
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded.role === 'vendor') {
        redirect('/vendor/dashboard');
      }
    } catch (error) {
      // Invalid token, continue
    }
  }

  const { id } = await params;
  const search = (await searchParams)?.search || '';
  
  await dbConnect();

  // Get restaurant details
  const restaurant = await User.findById(id).lean();
  
  if (!restaurant || restaurant.role !== 'vendor') {
    notFound();
  }

  // Get menu items with optional search
  let menuItemsQuery = { 
    vendorId: id,
    available: true 
  };

  // Add text search if search query exists
  if (search && search.trim()) {
    menuItemsQuery.$text = { $search: search.trim() };
  }

  const menuItems = await MenuItem.find(menuItemsQuery).lean();

  // Get restaurant rating
  const reviews = await Review.aggregate([
    { $match: { vendorId: restaurant._id } },
    { 
      $group: { 
        _id: '$vendorId', 
        avgRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 }
      }
    }
  ]);

  const rating = reviews[0] || { avgRating: 0, reviewCount: 0 };

  // Group menu items by category
  const categories = {};
  menuItems.forEach(item => {
    if (!categories[item.category]) {
      categories[item.category] = [];
    }
    categories[item.category].push(item);
  });

  // Serialize data for client components
  const serializedRestaurant = {
    ...restaurant,
    _id: restaurant._id.toString(),
    restaurantImage: restaurant.restaurantImage || null,
    avgRating: rating.avgRating,
    reviewCount: rating.reviewCount
  };

  const serializedCategories = {};
  Object.entries(categories).forEach(([category, items]) => {
    serializedCategories[category] = items.map(item => ({
      ...item,
      _id: item._id.toString(),
      vendorId: item.vendorId.toString()
    }));
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] overflow-x-hidden relative">
      {/* Diagonal Gradient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-orange-500/20 via-orange-600/10 to-transparent blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-orange-600/20 via-orange-500/10 to-transparent blur-3xl"></div>
      </div>

      {/* Header */}
      <Navbar />

      {/* Restaurant Header */}
      <RestaurantHeader restaurant={serializedRestaurant} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Section */}
          <div className="lg:col-span-2">
            {/* Search Bar for Menu Items */}
            <MenuSearchBar restaurantId={id} initialSearch={search} />

            {search && (
              <p className="text-gray-400 mb-4 mt-4">
                Search results for: <span className="text-white font-semibold">"{search}"</span>
              </p>
            )}

            {Object.keys(serializedCategories).length === 0 ? (
              <div className="glass-dark rounded-xl p-12 text-center border border-gray-800">
                <div className="text-6xl mb-4">🍽️</div>
                <p className="text-gray-400 text-lg">
                  {search ? 'No menu items found for your search' : 'No menu items available'}
                </p>
              </div>
            ) : (
              Object.entries(serializedCategories).map(([category, items]) => (
                <div key={category} className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <span className="text-orange-500">▸</span>
                    {category}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {items.map((item) => (
                      <MenuItemCard 
                        key={item._id} 
                        item={item} 
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <Cart restaurantId={id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}