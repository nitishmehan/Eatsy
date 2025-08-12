import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
    name: String,
    price: Number,
    quantity: Number
  }],
  total: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  deliveryAddress: { type: String, required: true },
  paymentMethod: { type: String, enum: ['cash', 'card', 'upi'], default: 'cash' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Add indexes for better query performance
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ vendorId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
// Add compound index for vendor dashboard queries
orderSchema.index({ vendorId: 1, status: 1, createdAt: -1 });

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
