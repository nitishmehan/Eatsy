'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BlogDetail({ blog, currentUserId }) {
  const router = useRouter();
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [liked, setLiked] = useState(currentUserId ? blog.likes.includes(currentUserId) : false);
  const [likeCount, setLikeCount] = useState(blog.likes.length);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLike = async () => {
    if (!currentUserId) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch(`/api/blogs/${blog._id}/like`, {
        method: 'POST'
      });

      if (res.ok) {
        setLiked(!liked);
        setLikeCount(liked ? likeCount - 1 : likeCount + 1);
      }
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!currentUserId) {
      router.push('/login');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/blogs/${blog._id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment })
      });

      if (res.ok) {
        setComment('');
        router.refresh();
      }
    } catch (error) {
      console.error('Comment error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(true);

    try {
      const res = await fetch(`/api/blogs/${blog._id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        router.push('/blogs/my-blogs');
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete blog');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting blog');
    } finally {
      setDeleteLoading(false);
    }
  };

  const isOwner = currentUserId && blog.userId?._id === currentUserId;

  return (
    <div>
      {/* Back Button */}
      <Link href="/blogs" className="text-gray-400 hover:text-orange-500 transition mb-4 inline-flex items-center gap-2">
        <span>←</span> Back to Blogs
      </Link>

      {/* Blog Content */}
      <div className="glass-dark rounded-xl p-8 border border-gray-800 mb-6">
        {/* Category Badge */}
        <div className="mb-4">
          <span className="text-xs bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full border border-orange-500/30">
            {blog.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-white mb-4">{blog.title}</h1>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-6 pb-6 border-b border-gray-700">
          <span>By {blog.userId?.name || 'Unknown'}</span>
          <span>•</span>
          <span>{formatDate(blog.createdAt)}</span>
        </div>

        {/* Cover Image */}
        {blog.image && (
          <div className="mb-6 rounded-xl overflow-hidden">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full max-h-96 object-cover"
            />
          </div>
        )}

        {/* Content - Use whitespace-pre-wrap but escape HTML */}
        <div className="text-gray-300 text-lg leading-relaxed mb-6 whitespace-pre-wrap break-words">
          {blog.content}
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {blog.tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-white/5 text-gray-400 px-3 py-1 rounded-full border border-gray-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 pt-6 border-t border-gray-700">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              liked
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            ❤️ {likeCount}
          </button>

          <span className="text-gray-400">💬 {blog.comments.length} Comments</span>

          {isOwner && (
            <>
              <Link
                href={`/blogs/${blog._id}/edit`}
                className="ml-auto bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition border border-blue-500/30 font-medium"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30 transition border border-red-500/30 font-medium disabled:opacity-50"
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Comments Section */}
      <div className="glass-dark rounded-xl p-8 border border-gray-800">
        <h2 className="text-2xl font-bold text-white mb-6">Comments ({blog.comments.length})</h2>

        {/* Comment Form */}
        {currentUserId ? (
          <form onSubmit={handleComment} className="mb-8">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-white mb-3"
              rows="3"
              placeholder="Write a comment..."
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition font-semibold disabled:opacity-50"
            >
              {loading ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        ) : (
          <div className="mb-8 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
            <p className="text-orange-400 text-sm">
              <Link href="/login" className="hover:underline">Login</Link> to leave a comment
            </p>
          </div>
        )}

        {/* Comments List */}
        {blog.comments.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No comments yet. Be the first to comment!</p>
        ) : (
          <div className="space-y-4">
            {blog.comments.map((comment) => (
              <div key={comment._id} className="bg-white/5 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-white font-medium">{comment.userId?.name || 'Unknown'}</span>
                  <span className="text-gray-500 text-sm">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="text-gray-300">{comment.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
