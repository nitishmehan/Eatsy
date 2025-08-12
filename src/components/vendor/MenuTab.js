'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MenuItemForm from './MenuItemForm';

export default function MenuTab({ menuItems, vendorId }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filter, setFilter] = useState('all');

  const categories = ['all', ...new Set(menuItems.map(item => item.category))];

  const filteredItems = filter === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === filter);

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (itemId) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const res = await fetch(`/api/vendor/menu/${itemId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert('Failed to delete item');
      }
    } catch (error) {
      alert('Error deleting item');
    }
  };

  const toggleAvailability = async (itemId, currentAvailability) => {
    try {
      const res = await fetch(`/api/vendor/menu/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available: !currentAvailability })
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert('Failed to update availability');
      }
    } catch (error) {
      alert('Error updating availability');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingItem(null);
    router.refresh();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Menu Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition font-semibold"
        >
          + Add New Item
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
              filter === category
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-gray-700'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Menu Items */}
      {filteredItems.length === 0 ? (
        <div className="glass-dark rounded-xl p-12 text-center border border-gray-800">
          <div className="text-6xl mb-4">🍽️</div>
          <p className="text-gray-400 text-lg">No menu items found</p>
          <p className="text-gray-500 text-sm mt-2">Add your first menu item to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div key={item._id} className="glass-dark rounded-xl overflow-hidden border border-gray-800 hover:border-orange-500/50 transition">
              {/* Image Section - Always show, with placeholder if no image */}
              <div className="h-32 overflow-hidden bg-gray-900">
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                    <div className="text-center">
                      <span className="text-4xl mb-1 block">🍽️</span>
                      <p className="text-gray-500 text-xs">Pic not available</p>
                    </div>
                  </div>
                )}
                {/* Hidden fallback for broken images */}
                <div className="w-full h-full hidden items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                  <div className="text-center">
                    <span className="text-4xl mb-1 block">🍽️</span>
                    <p className="text-gray-500 text-xs">Pic not available</p>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-4">
                {/* Availability Toggle at Top */}
                <div className="flex items-center justify-between mb-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.available}
                      onChange={() => toggleAvailability(item._id, item.available)}
                      className="w-4 h-4 rounded accent-orange-500"
                    />
                    <span className={`text-sm font-medium ${item.available ? 'text-green-400' : 'text-red-400'}`}>
                      {item.available ? 'Available' : 'Unavailable'}
                    </span>
                  </label>
                  <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full border border-orange-500/30">
                    {item.category}
                  </span>
                </div>

                <div className="mb-3">
                  <h3 className="text-lg font-bold text-white mb-1">{item.name}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-2">{item.description}</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {item.dietary?.map((diet) => (
                    <span key={diet} className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full border border-green-500/30">
                      {diet}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mb-3">
                  <p className="text-xl font-bold text-orange-400">₹{item.price.toFixed(2)}</p>
                  <p className="text-gray-400 text-sm">🕐 {item.preparationTime} min</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="flex-1 bg-red-500/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30 transition text-sm font-medium border border-red-500/30"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <MenuItemForm
          vendorId={vendorId}
          item={editingItem}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}
