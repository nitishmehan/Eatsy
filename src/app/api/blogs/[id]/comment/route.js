import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(request, { params }) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== 'customer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const { comment } = await request.json();

    if (!comment || !comment.trim()) {
      return NextResponse.json({ error: 'Comment is required' }, { status: 400 });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    blog.comments.push({
      userId: user.userId,
      comment: comment.trim()
    });

    await blog.save();

    return NextResponse.json({ 
      message: 'Comment added successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Comment blog error:', error);
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
  }
}
