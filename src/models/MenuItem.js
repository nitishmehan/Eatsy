import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  category: { type: String, required: true },
  dietary: [{ type: String }],
  available: { type: Boolean, default: true },
  preparationTime: { type: Number },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Indexes for filtering
menuItemSchema.index({ vendorId: 1, available: 1 });
menuItemSchema.index({ category: 1 });
menuItemSchema.index({ price: 1 });

// Add text index for search
menuItemSchema.index({ 
  name: 'text', 
  description: 'text',
  category: 'text'
});

export default mongoose.models.MenuItem || mongoose.model('MenuItem', menuItemSchema);
