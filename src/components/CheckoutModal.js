'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DELIVERY_FEE } from '@/lib/constants';

export default function CheckoutModal({ cart, vendorId, onClose }) {
  const router = useRouter();
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId,
          items: cart.map(item => ({
            menuItemId: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
          })),
          total: total + DELIVERY_FEE,
          deliveryAddress
        })
      });

      if (res.ok) {
        // Clear cart from localStorage
        localStorage.removeItem(`cart_${vendorId}`);
        
        // Trigger cart update event
        window.dispatchEvent(new Event('cartUpdated'));
        
        // Show success message
        setOrderPlaced(true);
        
        // Redirect after 2 seconds
        setTimeout(() => {
          onClose();
          router.push('/orders');
          router.refresh();
        }, 2000);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to place order');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="glass-dark rounded-2xl border border-gray-800 max-w-md w-full p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-white mb-2">Order Delivered!</h2>
          <p className="text-gray-400 mb-4">Your order has been delivered successfully</p>
          <p className="text-green-400 text-sm">Redirecting to home...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-dark rounded-2xl border border-gray-800 max-w-md w-full">
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

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handlePlaceOrder} className="space-y-4">
            {/* Order Summary */}
            <div className="bg-white/5 rounded-lg p-4 mb-4">
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

            {/* Payment Info */}
            <div className="bg-blue-500/10 border border-blue-500/50 text-blue-400 px-4 py-3 rounded-lg text-sm">
              <p className="font-semibold mb-1">💵 Cash on Delivery</p>
              <p className="text-xs opacity-80">Pay when your order arrives</p>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition font-semibold disabled:opacity-50"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
