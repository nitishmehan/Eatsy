import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== 'customer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { title, content, image, category, tags } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const blog = await Blog.create({
      userId: user.userId,
      title,
      content,
      image: image || undefined,
      category: category || 'Other',
      tags: tags || []
    });

    return NextResponse.json({
      message: 'Blog created successfully',
      blog: {
        _id: blog._id.toString()
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Create blog error:', error);
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
  }
}
