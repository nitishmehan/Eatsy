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
    const { restaurantName, restaurantImage, cuisine, priceRange, estimatedDelivery, address } = await request.json();

    if (!restaurantName || !cuisine || cuisine.length === 0 || !priceRange || !estimatedDelivery || !address) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const updateData = {
      restaurantName,
      cuisine,
      priceRange,
      estimatedDelivery,
      address
    };

    // Only update image if provided
    if (restaurantImage) {
      updateData.restaurantImage = restaurantImage;
    }

    const vendor = await User.findByIdAndUpdate(
      user.userId,
      updateData,
      { new: true }
    );

    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Restaurant details updated successfully',
      vendor: {
        restaurantName: vendor.restaurantName,
        cuisine: vendor.cuisine,
        priceRange: vendor.priceRange,
        estimatedDelivery: vendor.estimatedDelivery,
        address: vendor.address
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Update restaurant error:', error);
    return NextResponse.json({ error: 'Failed to update restaurant' }, { status: 500 });
  }
}
