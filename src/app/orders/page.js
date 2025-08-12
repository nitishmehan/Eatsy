import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import Navbar from '@/components/Navbar';
import OrderCard from '@/components/OrderCard';
import Review from '@/models/Review';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export const metadata = {
  title: 'Order History - Eatsy',
  description: 'View your order history'
};

export default async function OrderHistoryPage() {
  // Check authentication
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    redirect('/login');
  }

  // Redirect vendors to their dashboard
  if (decoded.role === 'vendor') {
    redirect('/vendor/dashboard');
  }

  await dbConnect();

  // Get customer's orders
  const orders = await Order.find({ userId: decoded.userId })
    .populate('vendorId', 'restaurantName')
    .sort({ createdAt: -1 })
    .lean();

  // Get all reviews by this customer
  const customerReviews = await Review.find({ userId: decoded.userId }).lean();
  
  // Create a Set of order IDs that have been reviewed (filter out null/undefined)
  const reviewedOrderIds = new Set(
    customerReviews
      .filter(r => r.orderId)
      .map(r => r.orderId.toString())
  );

  // Serialize orders
  const serializedOrders = JSON.parse(JSON.stringify(orders)).map(order => ({
    _id: order._id,
    userId: order.userId,
    vendorId: order.vendorId ? {
      _id: order.vendorId._id,
      restaurantName: order.vendorId.restaurantName
    } : null,
    items: order.items.map(item => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      menuItemId: item.menuItemId || null
    })),
    total: order.total,
    status: order.status,
    deliveryAddress: order.deliveryAddress,
    paymentMethod: order.paymentMethod || 'cash',
    createdAt: order.createdAt,
    hasReview: reviewedOrderIds.has(order._id) // Check if this specific order ID has been reviewed
  }));

  return (
    <div className="min-h-screen bg-[#0a0a0a] overflow-x-hidden relative">
      {/* Diagonal Gradient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-orange-500/20 via-orange-600/10 to-transparent blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-orange-600/20 via-orange-500/10 to-transparent blur-3xl"></div>
      </div>

      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <h1 className="text-3xl font-bold text-white mb-8">Order History</h1>

        {serializedOrders.length === 0 ? (
          <div className="glass-dark rounded-xl p-12 text-center border border-gray-800">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-400 text-lg mb-4">No orders yet</p>
            <p className="text-gray-500 text-sm">Start ordering from your favorite restaurants!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {serializedOrders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
