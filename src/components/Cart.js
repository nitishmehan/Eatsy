'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CheckoutModal from './CheckoutModal';
import { DELIVERY_FEE } from '@/lib/constants';

export default function Cart({ restaurantId }) {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    loadCart();
    window.addEventListener('cartUpdated', loadCart);
    
    // Warn user before leaving if cart has items
    const handleBeforeUnload = (e) => {
      if (cart.length > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('cartUpdated', loadCart);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [cart.length]);

  const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart.filter(item => item.vendorId === restaurantId));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    // Check if user is logged in
    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) {
        router.push('/login');
        return;
      }
      
      // Show checkout modal
      setShowCheckout(true);
    } catch (error) {
      router.push('/login');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="glass-dark rounded-xl p-6 border border-gray-800 text-center">
        <div className="text-5xl mb-3">🛒</div>
        <p className="text-gray-400">Your cart is empty</p>
        <p className="text-gray-500 text-sm mt-2">Add items to get started</p>
      </div>
    );
  }

  return (
    <>
      <div className="glass-dark rounded-xl p-6 border border-gray-800">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          🛒 Your Cart
        </h3>

        <div className="space-y-3 mb-4">
          {cart.map((item) => (
            <div key={item._id} className="flex justify-between items-start text-sm">
              <div className="flex-1">
                <p className="text-white font-medium">{item.name}</p>
                <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
              </div>
              <p className="text-orange-400 font-bold">
                ₹{(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-700 pt-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Subtotal</span>
            <span className="text-white font-bold">₹{total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Delivery Fee</span>
            <span className="text-white font-bold">₹{DELIVERY_FEE.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-lg">
            <span className="text-white font-bold">Total</span>
            <span className="text-orange-400 font-bold">₹{(total + DELIVERY_FEE).toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition font-semibold"
        >
          Proceed to Checkout
        </button>
      </div>

      {showCheckout && (
        <CheckoutModal
          cart={cart}
          total={total + DELIVERY_FEE}
          restaurantId={restaurantId}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </>
  );
}
