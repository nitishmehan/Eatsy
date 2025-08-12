'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ReviewModal({ order, onClose }) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const reviewData = {
        orderId: order._id,
        rating,
        comment: comment.trim() || undefined
      };

      const res = await fetch('/api/reviews/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });

      const data = await res.json();

      if (res.ok) {
        // Close modal and refresh page to update review status
        onClose();
        router.refresh();
      } else {
        setError(data.error || 'Failed to submit review');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-dark rounded-2xl border border-gray-800 max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Leave a Review</h2>
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
            {/* Restaurant Info */}
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-white font-semibold">{order.vendorId?.restaurantName}</p>
              <p className="text-gray-400 text-sm mb-2">Order #{order._id.slice(-8)}</p>
              <div className="text-xs text-gray-500">
                <p className="font-semibold mb-1">Items ordered:</p>
                {order.items.map((item, idx) => (
                  <p key={idx}>• {item.quantity}x {item.name}</p>
                ))}
              </div>
            </div>

            {/* Star Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="text-4xl transition hover:scale-110"
                  >
                    {star <= rating ? '⭐' : '☆'}
                  </button>
                ))}
              </div>
              <p className="text-gray-400 text-sm mt-2">
                {rating === 5 && 'Excellent!'}
                {rating === 4 && 'Great!'}
                {rating === 3 && 'Good'}
                {rating === 2 && 'Fair'}
                {rating === 1 && 'Poor'}
              </p>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Comment (optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-white"
                rows="4"
                placeholder="Share your experience..."
              />
            </div>

            {/* Submit Button */}
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
                {loading ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
