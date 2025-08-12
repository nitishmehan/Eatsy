import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import Blog from '@/models/Blog';
import User from '@/models/User'; // Add this import
import Navbar from '@/components/Navbar';
import BlogLayout from '@/components/blog/BlogLayout';
import MyBlogsList from '@/components/blog/MyBlogsList';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export const metadata = {
  title: 'My Blogs - Eatsy',
  description: 'Manage your blog posts'
};

export default async function MyBlogsPage() {
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

  // Get user's blogs
  const blogs = await Blog.find({ userId: decoded.userId })
    .sort({ createdAt: -1 })
    .lean();

  // Serialize blogs
  const serializedBlogs = blogs.map(blog => ({
    _id: blog._id.toString(),
    title: blog.title,
    content: blog.content,
    image: blog.image,
    category: blog.category,
    tags: blog.tags,
    likes: blog.likes.map(id => id.toString()),
    commentCount: blog.comments.length,
    createdAt: blog.createdAt.toISOString()
  }));

  return (
    <>
      <Navbar />
      <BlogLayout currentUserId={decoded.userId}>
        <div>
          <h1 className="text-3xl font-bold text-white mb-6">My Blogs</h1>
          <MyBlogsList blogs={serializedBlogs} />
        </div>
      </BlogLayout>
    </>
  );
}
