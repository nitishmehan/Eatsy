import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import Blog from '@/models/Blog';
import User from '@/models/User'; // Add this import
import Navbar from '@/components/Navbar';
import BlogLayout from '@/components/blog/BlogLayout';
import BlogDetail from '@/components/blog/BlogDetail';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export default async function BlogDetailPage({ params }) {
  const { id } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  let user = null;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      user = decoded;
      
      if (decoded.role === 'vendor') {
        redirect('/vendor/dashboard');
      }
    } catch (error) {
      // Invalid token
    }
  }

  await dbConnect();

  // Get user name if logged in
  let userName = null;
  if (user) {
    const userDoc = await User.findById(user.userId).lean();
    userName = userDoc?.name;
  }

  const blog = await Blog.findById(id)
    .populate('userId', 'name')
    .populate('comments.userId', 'name')
    .lean();

  if (!blog) {
    notFound();
  }

  // Serialize blog
  const serializedBlog = {
    _id: blog._id.toString(),
    userId: blog.userId ? {
      _id: blog.userId._id.toString(),
      name: blog.userId.name
    } : null,
    title: blog.title,
    content: blog.content,
    image: blog.image,
    category: blog.category,
    tags: blog.tags,
    likes: blog.likes.map(id => id.toString()),
    comments: blog.comments.map(comment => ({
      _id: comment._id.toString(),
      userId: comment.userId ? {
        _id: comment.userId._id.toString(),
        name: comment.userId.name
      } : null,
      comment: comment.comment,
      createdAt: comment.createdAt.toISOString()
    })),
    createdAt: blog.createdAt.toISOString()
  };

  return (
    <>
      <Navbar />
      <BlogLayout currentUserId={user?.userId}>
        <BlogDetail blog={serializedBlog} currentUserId={user?.userId} />
      </BlogLayout>
    </>
  );
}
