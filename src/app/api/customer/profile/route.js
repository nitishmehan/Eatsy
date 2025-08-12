import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { getUserFromRequest } from '@/lib/auth';

export async function PUT(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== 'customer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { name, phone, currentPassword, newPassword } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Get current user data
    const currentUser = await User.findById(user.userId);
    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update basic info
    currentUser.name = name;
    currentUser.phone = phone || currentUser.phone;

    // If changing password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'Current password is required' }, { status: 400 });
      }

      const isValidPassword = await bcrypt.compare(currentPassword, currentUser.password);
      if (!isValidPassword) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
      }

      if (newPassword.length < 6) {
        return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 });
      }

      // Hash and update password
      currentUser.password = await bcrypt.hash(newPassword, 10);
    }

    await currentUser.save();

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      user: {
        name: currentUser.name,
        phone: currentUser.phone
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
