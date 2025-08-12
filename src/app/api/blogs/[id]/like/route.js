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

    // Validate ObjectId
    if (!id || id.length !== 24) {
      return NextResponse.json({ error: 'Invalid blog ID' }, { status: 400 });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    const userIdString = user.userId;
    const hasLiked = blog.likes.some(like => like.toString() === userIdString);

    if (hasLiked) {
      blog.likes = blog.likes.filter(like => like.toString() !== userIdString);
    } else {
      blog.likes.push(userIdString);
    }

    await blog.save();

    return NextResponse.json({ 
      message: hasLiked ? 'Unliked' : 'Liked',
      likes: blog.likes.length
    }, { status: 200 });

  } catch (error) {
    console.error('Like blog error:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return NextResponse.json({ error: 'Invalid blog ID' }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Failed to like blog' }, { status: 500 });
  }
}
