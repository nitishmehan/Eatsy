'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MyBlogsList({ blogs }) {
  const router = useRouter();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDelete = async (blogId) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    try {
      const res = await fetch(`/api/blogs/${blogId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert('Failed to delete blog');
      }
    } catch (error) {
      alert('Error deleting blog');
    }
  };

  if (blogs.length === 0) {
    return (
      <div className="glass-dark rounded-xl p-12 text-center border border-gray-800">
        <div className="text-6xl mb-4">✍️</div>
        <p className="text-gray-400 text-lg mb-4">You haven't created any blogs yet</p>
        <Link
          href="/blogs/create"
          className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition font-semibold"
        >
          Create Your First Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {blogs.map((blog) => (
        <div key={blog._id} className="glass-dark rounded-xl p-6 border border-gray-800">
          <div className="flex gap-4">
            {/* Blog Image */}
            {blog.image ? (
              <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-900">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-32 h-32 flex-shrink-0 rounded-lg bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center">
                <span className="text-5xl">📝</span>
              </div>
            )}

            {/* Blog Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{blog.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-3">{blog.content}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full text-xs border border-orange-500/30">
                  {blog.category}
                </span>
                <span>❤️ {blog.likes.length}</span>
                <span>💬 {blog.commentCount}</span>
                <span>{formatDate(blog.createdAt)}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Link
                  href={`/blogs/${blog._id}`}
                  className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition text-sm font-medium"
                >
                  View
                </Link>
                <Link
                  href={`/blogs/${blog._id}/edit`}
                  className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition text-sm font-medium border border-blue-500/30"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30 transition text-sm font-medium border border-red-500/30"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
