'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DELIVERY_FEE } from '@/lib/constants';

export default function CheckoutModal({ cart, vendorId, onClose }) {
  const router = useRouter();
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Calculate total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (!deliveryAddress || !deliveryAddress.trim()) {
      setError('Delivery address is required');
      return;
    }
    
    if (deliveryAddress.trim().length < 10) {
      setError('Please enter a complete delivery address');
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      const orderData = {
        vendorId,
        items: cart.map(item => ({
          menuItemId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total: total + DELIVERY_FEE,
        deliveryAddress: deliveryAddress.trim()
      };

      console.log('Sending order:', orderData); // Debug log

      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const data = await res.json();

      if (res.ok) {
        // Clear cart from localStorage
        localStorage.removeItem(`cart_${vendorId}`);
        
        // Trigger cart update event
        window.dispatchEvent(new Event('cartUpdated'));
        
        alert('Order placed successfully!');
        onClose();
        router.push('/orders');
        router.refresh();
      } else {
        console.error('Order error:', data); // Debug log
        setError(data.error || 'Failed to place order');
      }
    } catch (err) {
      console.error('Request error:', err); // Debug log
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-dark rounded-2xl border border-gray-800 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Checkout</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handlePlaceOrder} className="space-y-4">
            {/* Order Summary */}
            <div className="bg-white/5 rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-semibold mb-3">Order Summary</h3>
              <div className="space-y-2">
                {cart.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span className="text-gray-300">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="text-orange-400 font-bold">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="border-t border-gray-700 pt-2 mt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white">₹{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Delivery Fee</span>
                    <span className="text-white">₹{DELIVERY_FEE.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-orange-400">₹{(total + DELIVERY_FEE).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Delivery Address *
              </label>
              <textarea
                required
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-white"
                rows="3"
                placeholder="Enter your complete delivery address..."
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Buttons */}
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
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
