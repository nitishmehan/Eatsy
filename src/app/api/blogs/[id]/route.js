import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { getUserFromRequest } from '@/lib/auth';

export async function PUT(request, { params }) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== 'customer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const { title, content, image, category, tags } = await request.json();

    // Find blog and verify ownership
    const blog = await Blog.findOne({ _id: id, userId: user.userId });

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found or unauthorized' }, { status: 404 });
    }

    blog.title = title;
    blog.content = content;
    blog.image = image || undefined;
    blog.category = category;
    blog.tags = tags;

    await blog.save();

    return NextResponse.json({
      message: 'Blog updated successfully',
      blog: {
        _id: blog._id.toString()
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Update blog error:', error);
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== 'customer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;

    // Find and delete only if user owns the blog
    const blog = await Blog.findOneAndDelete({ _id: id, userId: user.userId });

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Blog deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error('Delete blog error:', error);
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
  }
}
