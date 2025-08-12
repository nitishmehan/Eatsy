import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Order from '@/models/Order';
import VendorLayout from '@/components/vendor/VendorLayout';
import OrdersTab from '@/components/vendor/OrdersTab';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export default async function OrdersPage() {
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

  const orders = await Order.find({ vendorId: vendor._id })
    .populate('userId', 'name phone')
    .sort({ createdAt: -1 })
    .lean();

  const serializedVendor = {
    ...vendor,
    _id: vendor._id.toString()
  };

  // This fetches orders from MongoDB - each order has an _id field
  const serializedOrders = JSON.parse(JSON.stringify(orders)).map(order => ({
    _id: order._id,  // <-- This is the MongoDB ObjectId (as string after JSON.parse)
    userId: order.userId ? {
      _id: order.userId._id,
      name: order.userId.name,
      phone: order.userId.phone
    } : null,
    vendorId: order.vendorId,
    items: order.items.map(item => ({
      menuItemId: item.menuItemId || null,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    })),
    total: order.total,
    status: order.status,
    deliveryAddress: order.deliveryAddress,
    paymentMethod: order.paymentMethod || 'cash',
    createdAt: order.createdAt
  }));

  return (
    <VendorLayout vendor={serializedVendor} currentTab="orders">
      <OrdersTab orders={serializedOrders} />
    </VendorLayout>
  );
}
