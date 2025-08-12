'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OrdersTab({ orders }) {
  const router = useRouter();
  const [filter, setFilter] = useState('all');

  const statuses = ['all', 'pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'];

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(order => order.status === filter);

  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/vendor/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      alert('Failed to update order');
    }
  };

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
      // Use a consistent format that works on both server and client
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Orders Management</h1>

      {/* Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
              filter === status
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-gray-700'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="glass-dark rounded-xl p-12 text-center border border-gray-800">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-gray-400 text-lg">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order._id} className="glass-dark rounded-xl p-6 border border-gray-800">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-white font-bold text-lg">Order #{order._id.slice(-6)}</p>
                  <p className="text-gray-400 text-sm">
                    {formatDate(order.createdAt)}
                  </p>
                  <p className="text-gray-300 mt-1">
                    Customer: {order.userId?.name || 'Unknown'}
                  </p>
                  {order.userId?.phone && (
                    <p className="text-gray-400 text-sm">📞 {order.userId.phone}</p>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${getStatusColor(order.status)}`}>
                  {order.status.replace('-', ' ')}
                </span>
              </div>

              <div className="border-t border-gray-700 pt-4 mb-4">
                <p className="text-gray-400 text-sm mb-2">Items:</p>
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm mb-1">
                    <span className="text-white">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="text-orange-400">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold mt-2 pt-2 border-t border-gray-700">
                  <span className="text-white">Total</span>
                  <span className="text-orange-400 text-lg">₹{order.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4 mb-4">
                <p className="text-gray-400 text-sm mb-1">Delivery Address:</p>
                <p className="text-white">{order.deliveryAddress}</p>
                <p className="text-gray-400 text-sm mt-2">Payment: {order.paymentMethod}</p>
              </div>

              {order.status !== 'delivered' && order.status !== 'cancelled' && (
                <div className="flex gap-2">
                  {order.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateStatus(order._id, 'confirmed')}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition text-sm font-medium"
                      >
                        Confirm Order
                      </button>
                      <button
                        onClick={() => updateStatus(order._id, 'cancelled')}
                        className="flex-1 bg-red-500/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30 transition text-sm font-medium border border-red-500/30"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {order.status === 'confirmed' && (
                    <button
                      onClick={() => updateStatus(order._id, 'preparing')}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-purple-700 transition text-sm font-medium"
                    >
                      Start Preparing
                    </button>
                  )}
                  {order.status === 'preparing' && (
                    <button
                      onClick={() => updateStatus(order._id, 'out-for-delivery')}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition text-sm font-medium"
                    >
                      Out for Delivery
                    </button>
                  )}
                  {order.status === 'out-for-delivery' && (
                    <button
                      onClick={() => updateStatus(order._id, 'delivered')}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition text-sm font-medium"
                    >
                      Mark as Delivered
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
