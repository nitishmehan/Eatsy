'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AnalyticsTab({ stats, vendor }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const toggleRestaurantStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/vendor/restaurant/status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isOpen: !vendor.isOpen })
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      alert('Error updating status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Analytics Overview</h1>
        
        {/* Open/Close Restaurant Button */}
        <button
          onClick={toggleRestaurantStatus}
          disabled={loading}
          className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
            vendor.isOpen
              ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
              : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
          } disabled:opacity-50`}
        >
          {loading ? (
            'Updating...'
          ) : vendor.isOpen ? (
            <>
              <span>🔴</span>
              Close Restaurant
            </>
          ) : (
            <>
              <span>🟢</span>
              Open Restaurant
            </>
          )}
        </button>
      </div>

      {/* Status Alert */}
      <div className={`rounded-xl p-4 mb-6 border ${
        vendor.isOpen
          ? 'bg-green-500/10 border-green-500/50 text-green-400'
          : 'bg-red-500/10 border-red-500/50 text-red-400'
      }`}>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{vendor.isOpen ? '🟢' : '🔴'}</span>
          <p className="font-semibold">
            Your restaurant is currently {vendor.isOpen ? 'OPEN' : 'CLOSED'}
          </p>
        </div>
        <p className="text-sm mt-1 opacity-80">
          {vendor.isOpen 
            ? 'Customers can see your restaurant and place orders'
            : 'Your restaurant is hidden from customers. No new orders will be received'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass-dark rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-4xl">💰</span>
            <div className="text-right">
              <p className="text-2xl font-bold text-orange-400">₹{stats.totalRevenue.toFixed(2)}</p>
              <p className="text-gray-400 text-sm">Total Revenue</p>
            </div>
          </div>
        </div>

        <div className="glass-dark rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-4xl">📦</span>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{stats.totalOrders}</p>
              <p className="text-gray-400 text-sm">Total Orders</p>
            </div>
          </div>
        </div>

        <div className="glass-dark rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-4xl">🍽️</span>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{stats.totalMenuItems}</p>
              <p className="text-gray-400 text-sm">Menu Items</p>
            </div>
          </div>
        </div>

        <div className="glass-dark rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-4xl">⭐</span>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{stats.avgRating.toFixed(1)}</p>
              <p className="text-gray-400 text-sm">{stats.totalReviews} Reviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="glass-dark rounded-xl p-6 border border-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Restaurant Information</h2>
          <button
            onClick={() => setShowEditModal(true)}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition text-sm font-medium"
          >
            Edit Details
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400 mb-1">Restaurant Name</p>
            <p className="text-white font-medium">{vendor.restaurantName}</p>
          </div>
          <div>
            <p className="text-gray-400 mb-1">Cuisine</p>
            <p className="text-white font-medium">{vendor.cuisine?.join(', ')}</p>
          </div>
          <div>
            <p className="text-gray-400 mb-1">Price Range</p>
            <p className="text-white font-medium">{vendor.priceRange}</p>
          </div>
          <div>
            <p className="text-gray-400 mb-1">Delivery Time</p>
            <p className="text-white font-medium">{vendor.estimatedDelivery} min</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-gray-400 mb-1">Address</p>
            <p className="text-white font-medium">{vendor.address}</p>
          </div>
          <div>
            <p className="text-gray-400 mb-1">Status</p>
            <p className={`font-medium ${vendor.isOpen ? 'text-green-400' : 'text-red-400'}`}>
              {vendor.isOpen ? '🟢 Open' : '🔴 Closed'}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Restaurant Modal */}
      {showEditModal && (
        <EditRestaurantModal
          vendor={vendor}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
}

function EditRestaurantModal({ vendor, onClose }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    restaurantName: vendor.restaurantName,
    restaurantImage: vendor.restaurantImage || '',
    cuisine: vendor.cuisine || [],
    priceRange: vendor.priceRange,
    estimatedDelivery: vendor.estimatedDelivery,
    address: vendor.address
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cuisineOptions = ['Italian', 'Chinese', 'Japanese', 'Indian', 'Mexican', 'Pizza', 'Burger', 'Sushi'];

  const toggleCuisine = (cuisine) => {
    if (formData.cuisine.includes(cuisine)) {
      setFormData({
        ...formData,
        cuisine: formData.cuisine.filter(c => c !== cuisine)
      });
    } else {
      setFormData({
        ...formData,
        cuisine: [...formData.cuisine, cuisine]
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.cuisine.length === 0) {
      setError('Please select at least one cuisine');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/vendor/restaurant/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        onClose();
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update restaurant');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-dark rounded-2xl border border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Edit Restaurant Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Restaurant Name *
              </label>
              <input
                type="text"
                required
                value={formData.restaurantName}
                onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Restaurant Image URL (optional)
              </label>
              <input
                type="url"
                value={formData.restaurantImage}
                onChange={(e) => setFormData({ ...formData, restaurantImage: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-white"
                placeholder="https://example.com/image.jpg"
              />
              {formData.restaurantImage && (
                <div className="mt-2">
                  <p className="text-xs text-gray-400 mb-2">Preview:</p>
                  <img 
                    src={formData.restaurantImage} 
                    alt="Preview" 
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cuisine Types * (Select at least one)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {cuisineOptions.map((cuisine) => (
                  <button
                    key={cuisine}
                    type="button"
                    onClick={() => toggleCuisine(cuisine)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      formData.cuisine.includes(cuisine)
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-gray-700'
                    }`}
                  >
                    {cuisine}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price Range *
                </label>
                <select
                  required
                  value={formData.priceRange}
                  onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-white"
                >
                  <option value="under-100" className="bg-[#1a1a1a]">Under ₹100</option>
                  <option value="100-300" className="bg-[#1a1a1a]">₹100 - ₹300</option>
                  <option value="300-500" className="bg-[#1a1a1a]">₹300 - ₹500</option>
                  <option value="500+" className="bg-[#1a1a1a]">₹500+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Est. Delivery (min) *
                </label>
                <input
                  type="number"
                  required
                  min="10"
                  max="120"
                  value={formData.estimatedDelivery}
                  onChange={(e) => setFormData({ ...formData, estimatedDelivery: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Address *
              </label>
              <textarea
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-white"
                rows="3"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-white/10 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition font-semibold disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
