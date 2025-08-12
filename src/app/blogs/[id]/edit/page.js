import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import Blog from '@/models/Blog';
import User from '@/models/User'; // Add this import
import Navbar from '@/components/Navbar';
import BlogLayout from '@/components/blog/BlogLayout';
import BlogForm from '@/components/blog/BlogForm';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export default async function EditBlogPage({ params }) {
  const { id } = await params;

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

  await dbConnect();

  // Get user name
  const userDoc = await User.findById(decoded.userId).lean();
  const userName = userDoc?.name;

  const blog = await Blog.findById(id).lean();

  if (!blog) {
    notFound();
  }

  // Check if user owns the blog
  if (blog.userId.toString() !== decoded.userId) {
    redirect('/blogs');
  }

  const serializedBlog = {
    _id: blog._id.toString(),
    title: blog.title,
    content: blog.content,
    image: blog.image,
    category: blog.category,
    tags: blog.tags
  };

  return (
    <>
      <Navbar />
      <BlogLayout currentUserId={decoded.userId}>
        <div>
          <h1 className="text-3xl font-bold text-white mb-6">Edit Blog</h1>
          <BlogForm blog={serializedBlog} />
        </div>
      </BlogLayout>
    </>
  );
}
