import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User'; // Add this import
import Navbar from '@/components/Navbar';
import BlogLayout from '@/components/blog/BlogLayout';
import BlogForm from '@/components/blog/BlogForm';

export default async function CreateBlogPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role === 'vendor') {
      redirect('/vendor/dashboard');
    }
  } catch (error) {
    redirect('/login');
  }

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
