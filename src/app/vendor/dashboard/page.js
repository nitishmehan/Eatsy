import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import MenuItem from '@/models/MenuItem';
import Order from '@/models/Order';
import Review from '@/models/Review';
import VendorLayout from '@/components/vendor/VendorLayout';
import AnalyticsTab from '@/components/vendor/AnalyticsTab';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export const metadata = {
  title: 'Vendor Dashboard - Eatsy',
  description: 'Manage your restaurant'
};

export default async function VendorDashboard({ searchParams }) {
  const params = await searchParams;
  const tab = params?.tab || 'analytics';

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

  if (decoded.role !== 'vendor') {
    redirect('/');
  }

  await dbConnect();

  // Get vendor details
  const vendor = await User.findById(decoded.userId).lean();
  if (!vendor) {
    redirect('/login');
  }

  // Get statistics
  const totalMenuItems = await MenuItem.countDocuments({ vendorId: vendor._id });
  const totalOrders = await Order.countDocuments({ vendorId: vendor._id });
  const totalRevenue = await Order.aggregate([
    { $match: { vendorId: vendor._id, status: 'delivered' } },
    { $group: { _id: null, total: { $sum: '$total' } } }
  ]);

  const reviews = await Review.aggregate([
    { $match: { vendorId: vendor._id } },
    { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);

  const stats = {
    totalMenuItems,
    totalOrders,
    totalRevenue: totalRevenue[0]?.total || 0,
    avgRating: reviews[0]?.avgRating || 0,
    totalReviews: reviews[0]?.count || 0
  };

  const serializedVendor = {
    ...vendor,
    _id: vendor._id.toString()
  };

  return (
    <VendorLayout vendor={serializedVendor} currentTab={tab}>
      <AnalyticsTab stats={stats} vendor={serializedVendor} />
    </VendorLayout>
  );
}
