import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function fixReviews() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const reviewsCollection = db.collection('reviews');

    // Find and remove duplicate reviews (keep only the first one)
    const duplicates = await reviewsCollection.aggregate([
      {
        $group: {
          _id: { userId: "$userId", orderId: "$orderId" },
          ids: { $push: "$_id" },
          count: { $sum: 1 }
        }
      },
      {
        $match: { count: { $gt: 1 } }
      }
    ]).toArray();

    console.log(`Found ${duplicates.length} duplicate groups`);

    for (const duplicate of duplicates) {
      // Keep first, delete rest
      const idsToDelete = duplicate.ids.slice(1);
      const result = await reviewsCollection.deleteMany({ _id: { $in: idsToDelete } });
      console.log(`Deleted ${result.deletedCount} duplicate reviews`);
    }

    // Drop existing indexes except _id
    console.log('Dropping existing indexes...');
    await reviewsCollection.dropIndexes();

    // Create unique index
    console.log('Creating unique index on userId and orderId...');
    await reviewsCollection.createIndex(
      { userId: 1, orderId: 1 }, 
      { unique: true }
    );

    console.log('✅ Successfully fixed reviews and created unique index!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixReviews();
