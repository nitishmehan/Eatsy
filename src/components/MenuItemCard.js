'use client';
import { useState, useEffect } from 'react';

export default function MenuItemCard({ item }) {
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(i => i._id === item._id);
    if (existingItem) {
      setQuantity(existingItem.quantity);
    }
  }, [item._id]);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(i => i._id === item._id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    setQuantity(quantity + 1);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeFromCart = () => {
    if (quantity === 0) return;
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(i => i._id === item._id);

    if (existingItem) {
      if (existingItem.quantity > 1) {
        existingItem.quantity -= 1;
      } else {
        const index = cart.indexOf(existingItem);
        cart.splice(index, 1);
      }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    setQuantity(quantity - 1);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  return (
    <div className="glass-dark rounded-xl overflow-hidden border border-gray-800 hover:border-orange-500/50 transition group">
      {/* Image Section - Always show, with placeholder if no image */}
      <div className="h-40 overflow-hidden bg-gray-900">
        {item.image ? (
          <img 
            src={item.image} 
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <div className="text-center">
              <span className="text-5xl mb-2 block">🍽️</span>
              <p className="text-gray-500 text-sm">Pic not available</p>
            </div>
          </div>
        )}
        {/* Hidden fallback for broken images */}
        <div className="w-full h-full hidden items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="text-center">
            <span className="text-5xl mb-2 block">🍽️</span>
            <p className="text-gray-500 text-sm">Pic not available</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-orange-400 transition">
            {item.name}
          </h3>
          {item.description && (
            <p className="text-gray-400 text-sm line-clamp-2 mb-2">
              {item.description}
            </p>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {item.dietary?.map((diet) => (
            <span key={diet} className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full border border-green-500/30">
              {diet}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-orange-400">
            ₹{item.price.toFixed(2)}
          </p>
          
          {quantity === 0 ? (
            <button
              onClick={addToCart}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition text-sm font-semibold"
            >
              Add
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={removeFromCart}
                className="bg-white/10 text-white w-8 h-8 rounded-lg hover:bg-white/20 transition font-bold"
              >
                −
              </button>
              <span className="text-white font-bold w-8 text-center">{quantity}</span>
              <button
                onClick={addToCart}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white w-8 h-8 rounded-lg hover:from-orange-600 hover:to-orange-700 transition font-bold"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
