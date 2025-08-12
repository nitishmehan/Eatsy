import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Review from '@/models/Review';
import VendorLayout from '@/components/vendor/VendorLayout';
import ReviewsTab from '@/components/vendor/ReviewsTab';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export default async function ReviewsPage() {
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

  const vendor = await User.findById(decoded.userId).lean();
  if (!vendor) {
    redirect('/login');
  }

  const reviews = await Review.find({ vendorId: vendor._id })
    .populate('userId', 'name')
    .sort({ createdAt: -1 })
    .lean();

  const serializedVendor = {
    ...vendor,
    _id: vendor._id.toString()
  };

  const serializedReviews = reviews.map(review => ({
    _id: review._id.toString(),
    userId: review.userId ? {
      _id: review.userId._id.toString(),
      name: review.userId.name
    } : null,
    vendorId: review.vendorId.toString(),
    orderId: review.orderId ? review.orderId.toString() : null,
    items: review.items ? review.items.map(item => ({
      menuItemId: item.menuItemId?.toString(),
      name: item.name,
      quantity: item.quantity
    })) : [],
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt?.toISOString()
  }));

  return (
    <VendorLayout vendor={serializedVendor} currentTab="reviews">
      <ReviewsTab reviews={serializedReviews} />
    </VendorLayout>
  );
}
