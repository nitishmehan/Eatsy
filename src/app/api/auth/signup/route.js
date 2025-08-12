import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { email, password, role, name, phone, restaurantName, restaurantImage, cuisine, priceRange, address, estimatedDelivery } = body;

    // Validation
    if (!email || !password || !role || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user data
    const userData = {
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      name
    };

    // Only add phone if provided
    if (phone) {
      userData.phone = phone;
    }

    // Add vendor-specific fields ONLY for vendors
    if (role === 'vendor') {
      if (!restaurantName || !cuisine || !priceRange || !address) {
        return NextResponse.json(
          { error: 'Missing required vendor fields' },
          { status: 400 }
        );
      }

      userData.restaurantName = restaurantName;
      if (restaurantImage) {
        userData.restaurantImage = restaurantImage;
      }
      userData.cuisine = cuisine;
      userData.priceRange = priceRange;
      userData.address = address;
      userData.estimatedDelivery = parseInt(estimatedDelivery) || 30;
      userData.isOpen = true;
    }


    // Create user
    const user = await User.create(userData);

    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          name: user.name
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
