import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  items: [{
    menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
    name: String,
    quantity: Number
  }],
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Indexes for filtering and aggregation
reviewSchema.index({ vendorId: 1 });
reviewSchema.index({ rating: 1 });
// Compound index for vendor reviews page
reviewSchema.index({ vendorId: 1, createdAt: -1 });

// CRITICAL: Unique constraint - one review per user per order
reviewSchema.index({ userId: 1, orderId: 1 }, { unique: true });

export default mongoose.models.Review || mongoose.model('Review', reviewSchema);
