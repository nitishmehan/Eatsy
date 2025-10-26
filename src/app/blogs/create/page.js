import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Navbar from '@/components/Navbar';
import BlogLayout from '@/components/blog/BlogLayout';
import BlogForm from '@/components/blog/BlogForm';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export default async function CreateBlogPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);

    // Only redirect vendors, allow customers
    if (decoded.role === 'vendor') {
      redirect('/blogs'); // Redirect vendors to blog list instead
    }

  } catch (error) {
    redirect('/login');
  }

  await dbConnect();

  // Get user name
  const userDoc = await User.findById(decoded.userId).lean();
  const userName = userDoc?.name;

  return (
    <>
      <Navbar />
      <BlogLayout currentUserId={decoded.userId}>
        <div>
          <h1 className="text-3xl font-bold text-white mb-6">Create New Blog</h1>
          <BlogForm />
        </div>
      </BlogLayout>
    </>
  );
}
