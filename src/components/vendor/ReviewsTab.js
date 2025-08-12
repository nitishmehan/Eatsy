export default function ReviewsTab({ reviews }) {
  // Calculate average rating
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  // Group by rating
  const ratingCounts = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length
  }));

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Customer Reviews</h1>

      {/* Rating Summary */}
      <div className="glass-dark rounded-xl p-6 border border-gray-800 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center">
            <div className="text-6xl font-bold text-white mb-2">{avgRating}</div>
            <div className="text-yellow-400 text-2xl mb-2">{'⭐'.repeat(Math.round(avgRating))}</div>
            <p className="text-gray-400">{reviews.length} total reviews</p>
          </div>

          <div className="space-y-2">
            {ratingCounts.map(({ rating, count }) => (
              <div key={rating} className="flex items-center gap-3">
                <span className="text-white w-8">{rating}⭐</span>
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full"
                    style={{ width: `${reviews.length > 0 ? (count / reviews.length) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-gray-400 w-12 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="glass-dark rounded-xl p-12 text-center border border-gray-800">
          <div className="text-6xl mb-4">⭐</div>
          <p className="text-gray-400 text-lg">No reviews yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="glass-dark rounded-xl p-6 border border-gray-800">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-white font-medium">{review.userId?.name || 'Anonymous'}</p>
                  <p className="text-gray-400 text-sm">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                  {review.orderId && (
                    <p className="text-gray-500 text-xs mt-1">Order #{review.orderId.slice(-6)}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-1 rounded-lg">
                  <span>⭐</span>
                  <span className="font-bold">{review.rating}</span>
                </div>
              </div>

              {/* Items purchased - prominently displayed */}
              {review.items && review.items.length > 0 && (
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 mb-3">
                  <p className="text-orange-400 font-semibold text-sm mb-2 flex items-center gap-2">
                    🛍️ Items Purchased:
                  </p>
                  <div className="space-y-1">
                    {review.items.map((item, idx) => (
                      <p key={idx} className="text-white text-sm font-medium">
                        • {item.quantity}x {item.name}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Review comment */}
              {review.comment && (
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-gray-400 text-xs mb-1">Review:</p>
                  <p className="text-gray-300">{review.comment}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
