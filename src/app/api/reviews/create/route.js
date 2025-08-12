import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';
import Order from '@/models/Order';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== 'customer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { orderId, rating, comment } = await request.json();

    if (!orderId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    // Check if user already reviewed this specific order BEFORE getting order details
    const existingReview = await Review.findOne({
      userId: user.userId,
      orderId: orderId
    });

    if (existingReview) {
      return NextResponse.json({ error: 'You have already reviewed this order' }, { status: 400 });
    }

    // Get order details
    const order = await Order.findById(orderId).lean();
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Verify the order belongs to the user
    if (order.userId.toString() !== user.userId) {
      return NextResponse.json({ error: 'Unauthorized - This is not your order' }, { status: 401 });
    }

    // Verify order is delivered before allowing review
    if (order.status !== 'delivered') {
      return NextResponse.json({ error: 'You can only review delivered orders' }, { status: 400 });
    }

    // Create review with order items
    const reviewData = {
      userId: user.userId,
      vendorId: order.vendorId,
      orderId: orderId,
      items: order.items.map(item => ({
        menuItemId: item.menuItemId,
        name: item.name,
        quantity: item.quantity
      })),
      rating,
      comment: comment || undefined
    };

    const review = await Review.create(reviewData);

    return NextResponse.json({ 
      message: 'Review submitted successfully',
      review: {
        _id: review._id.toString()
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Create review error:', error);
    
    // Handle duplicate key error from MongoDB unique index
    if (error.code === 11000) {
      return NextResponse.json({ error: 'You have already reviewed this order' }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}
