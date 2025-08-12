import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import MenuItem from '@/models/MenuItem';
import VendorLayout from '@/components/vendor/VendorLayout';
import MenuTab from '@/components/vendor/MenuTab';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export default async function MenuPage() {
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

  const menuItems = await MenuItem.find({ vendorId: vendor._id }).sort({ category: 1, name: 1 }).lean();

  const serializedVendor = {
    ...vendor,
    _id: vendor._id.toString()
  };

  const serializedMenuItems = menuItems.map(item => ({
    ...item,
    _id: item._id.toString(),
    vendorId: item.vendorId.toString(),
    createdAt: item.createdAt?.toISOString(),
    updatedAt: item.updatedAt?.toISOString()
  }));

  return (
    <VendorLayout vendor={serializedVendor} currentTab="menu">
      <MenuTab menuItems={serializedMenuItems} vendorId={vendor._id.toString()} />
    </VendorLayout>
  );
}
