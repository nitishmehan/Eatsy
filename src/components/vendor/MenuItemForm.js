'use client';
import { useState } from 'react';

export default function MenuItemForm({ vendorId, item, onClose }) {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    description: item?.description || '',
    price: item?.price || '',
    category: item?.category || 'Main Course',
    dietary: item?.dietary || [],
    preparationTime: item?.preparationTime || 15,
    available: item?.available !== undefined ? item.available : true,
    image: item?.image || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = ['Appetizer', 'Main Course', 'Dessert', 'Beverages'];
  const dietaryOptions = ['veg', 'non-veg', 'vegan', 'gluten-free'];

  const toggleDietary = (option) => {
    if (formData.dietary.includes(option)) {
      setFormData({
        ...formData,
        dietary: formData.dietary.filter(d => d !== option)
      });
    } else {
      setFormData({
        ...formData,
        dietary: [...formData.dietary, option]
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = item 
        ? `/api/vendor/menu/${item._id}` 
        : '/api/vendor/menu';

      const res = await fetch(url, {
        method: item ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, vendorId })
      });

      if (res.ok) {
        onClose();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to save item');
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
            <h2 className="text-2xl font-bold text-white">
              {item ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h2>
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
                Item Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-white"
                placeholder="e.g., Margherita Pizza"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-white"
                rows="3"
                placeholder="Describe your dish..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Image URL (optional)
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-white"
                placeholder="https://example.com/image.jpg"
              />
              {formData.image && (
                <div className="mt-2">
                  <p className="text-xs text-gray-400 mb-2">Preview:</p>
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      setError('Invalid image URL');
                    }}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-white"
                  placeholder="129.99"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-[#1a1a1a]">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Dietary Options
              </label>
              <div className="flex flex-wrap gap-2">
                {dietaryOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleDietary(option)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                      formData.dietary.includes(option)
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-gray-700'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Prep Time (min)
              </label>
              <input
                type="number"
                min="5"
                value={formData.preparationTime}
                onChange={(e) => setFormData({ ...formData, preparationTime: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="available"
                checked={formData.available}
                onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <label htmlFor="available" className="text-sm text-gray-300">
                Available for ordering
              </label>
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
                {loading ? 'Saving...' : (item ? 'Update Item' : 'Add Item')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
