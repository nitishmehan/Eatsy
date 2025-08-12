import Link from 'next/link';

export default function BlogList({ blogs, currentUserId }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (blogs.length === 0) {
    return (
      <div className="glass-dark rounded-xl p-12 text-center border border-gray-800">
        <div className="text-6xl mb-4">📝</div>
        <p className="text-gray-400 text-lg">No blogs found</p>
        <p className="text-gray-500 text-sm mt-2">Be the first to create a blog!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {blogs.map((blog) => (
        <Link key={blog._id} href={`/blogs/${blog._id}`}>
          <div className="glass-dark rounded-xl overflow-hidden border border-gray-800 hover:border-orange-500/50 transition cursor-pointer group h-full flex flex-col">
            {/* Blog Image */}
            {blog.image ? (
              <div className="h-48 overflow-hidden bg-gray-900">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            ) : (
              <div className="h-48 bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center">
                <span className="text-7xl">📝</span>
              </div>
            )}

            {/* Blog Content */}
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full border border-orange-500/30">
                  {blog.category}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition line-clamp-2">
                {blog.title}
              </h3>

              <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
                {blog.content}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-700">
                <span>By {blog.userId?.name || 'Unknown'}</span>
                <span>{formatDate(blog.createdAt)}</span>
              </div>

              <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                <span>❤️ {blog.likes.length}</span>
                <span>💬 {blog.commentCount}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
