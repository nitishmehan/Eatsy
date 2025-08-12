import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/auth';

export async function PUT(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== 'vendor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { isOpen } = await request.json();

    const vendor = await User.findByIdAndUpdate(
      user.userId,
      { isOpen },
      { new: true }
    );

    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: `Restaurant ${isOpen ? 'opened' : 'closed'} successfully`,
      isOpen: vendor.isOpen 
    }, { status: 200 });
  } catch (error) {
    console.error('Update restaurant status error:', error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
