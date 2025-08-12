'use client';
import { useState } from 'react';
import ReviewModal from './ReviewModal';

export default function OrderCard({ order }) {
  const [showReviewModal, setShowReviewModal] = useState(false);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      confirmed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      preparing: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'out-for-delivery': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
      cancelled: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return colors[status] || colors.pending;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <>
      <div className="glass-dark rounded-xl p-6 border border-gray-800 hover:border-orange-500/50 transition">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-white font-bold text-lg">
                {order.vendorId?.restaurantName || 'Restaurant'}
              </h3>
              <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${getStatusColor(order.status)}`}>
                {order.status.replace('-', ' ')}
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Order #{order._id.slice(-8)} • {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-orange-400 font-bold text-xl">₹{order.total.toFixed(2)}</p>
            <p className="text-gray-500 text-xs">{order.items.length} items</p>
          </div>
        </div>

        {/* Items */}
        <div className="border-t border-gray-700 pt-4 mb-4">
          <p className="text-gray-400 text-sm mb-2">Items:</p>
          <div className="space-y-1">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-white">
                  {item.quantity}x {item.name}
                </span>
                <span className="text-gray-400">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Info */}
        <div className="border-t border-gray-700 pt-4">
          <div className="flex items-start gap-2 text-sm">
            <span className="text-orange-400">📍</span>
            <div>
              <p className="text-gray-400">Delivery Address:</p>
              <p className="text-white">{order.deliveryAddress}</p>
            </div>
          </div>
        </div>

        {/* Leave Review Button / Reviewed Badge */}
        {order.vendorId && order.status === 'delivered' && (
          <div className="border-t border-gray-700 pt-4 mt-4">
            {order.hasReview ? (
              <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg text-center">
                <span className="font-semibold">✓ Reviewed</span>
              </div>
            ) : (
              <button
                onClick={() => setShowReviewModal(true)}
                className="block w-full text-center bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition text-sm font-medium"
              >
                ⭐ Leave a Review
              </button>
            )}
          </div>
        )}
      </div>

      {showReviewModal && (
        <ReviewModal
          order={order}
          onClose={() => setShowReviewModal(false)}
        />
      )}
    </>
  );
}
