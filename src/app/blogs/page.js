import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import Blog from '@/models/Blog';
import User from '@/models/User';
import Navbar from '@/components/Navbar';
import BlogLayout from '@/components/blog/BlogLayout';
import BlogSearch from '@/components/blog/BlogSearch';
import BlogList from '@/components/blog/BlogList';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export const metadata = {
  title: 'Food Blogs - Eatsy',
  description: 'Read and share food blogs, recipes, and restaurant experiences'
};

export default async function BlogsPage({ searchParams }) {
  const params = await searchParams;
  const search = params?.search || '';
  const category = params?.category || '';

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  let user = null;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      user = decoded;
      
      // Only redirect vendors to dashboard, allow customers
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

  // Build query
  let query = {};
  
  if (search) {
    query.$text = { $search: search };
  }
  
  if (category) {
    query.category = category;
  }

  // Get blogs
  const blogs = await Blog.find(query)
    .populate('userId', 'name')
    .sort({ createdAt: -1 })
    .lean();

  // Serialize blogs
  const serializedBlogs = blogs.map(blog => ({
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
    commentCount: blog.comments.length,
    createdAt: blog.createdAt.toISOString()
  }));

  return (
    <>
      {/* Use regular Navbar instead of custom header */}
      <Navbar />
      
      {/* Use BlogLayout but it won't render its own header */}
      <BlogLayout currentUserId={user?.userId} hideHeader={true}>
        <div>
          <h1 className="text-3xl font-bold text-white mb-6">All Blogs</h1>
          
          {/* Search and Filter */}
          <BlogSearch initialSearch={search} initialCategory={category} />

          {/* Blog List */}
          <BlogList blogs={serializedBlogs} currentUserId={user?.userId} />
        </div>
      </BlogLayout>
    </>
  );
}
