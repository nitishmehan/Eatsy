import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function createIndexes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;

    // Create text indexes for search
    console.log('Creating text indexes...');
    
    await db.collection('users').createIndex(
      { restaurantName: 'text', cuisine: 'text', address: 'text' },
      { name: 'restaurant_search' }
    );
    
    await db.collection('menuitems').createIndex(
      { name: 'text', description: 'text', category: 'text' },
      { name: 'menuitem_search' }
    );
    
    await db.collection('blogs').createIndex(
      { title: 'text', content: 'text', tags: 'text' },
      { name: 'blog_search' }
    );

    console.log('✅ All indexes created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createIndexes();
