import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'vendor'], required: true },
  name: { type: String, required: true },
  phone: { type: String },
  
  // Vendor-specific fields (only for vendors)
  restaurantName: { 
    type: String,
    required: function() { return this.role === 'vendor'; }
  },
  restaurantImage: { 
    type: String // Optional image URL for restaurant
  },
  cuisine: { 
    type: [String]
  },
  priceRange: { 
    type: String, 
    enum: ['under-100', '100-300', '300-500', '500+'],
    required: function() { return this.role === 'vendor'; }
  },
  isOpen: { 
    type: Boolean
  },
  estimatedDelivery: { 
    type: Number,
    required: function() { return this.role === 'vendor'; }
  },
  address: { 
    type: String,
    required: function() { return this.role === 'vendor'; }
  },
  
  createdAt: { type: Date, default: Date.now }
}, { 
  timestamps: true
});

// Index for fast vendor lookups
userSchema.index({ role: 1, isOpen: 1 });

// Add text index for search
userSchema.index({ 
  restaurantName: 'text', 
  cuisine: 'text', 
  address: 'text' 
});

// Pre-save hook to clean up customer documents
userSchema.pre('save', function(next) {
  if (this.role === 'customer') {
    this.restaurantName = undefined;
    this.restaurantImage = undefined; // Add this line
    this.cuisine = undefined;
    this.priceRange = undefined;
    this.isOpen = undefined;
    this.estimatedDelivery = undefined;
    this.address = undefined;
  } else if (this.role === 'vendor') {
    if (this.isOpen === undefined) this.isOpen = true;
    if (!this.cuisine) this.cuisine = [];
  }
  next();
});

export default mongoose.models.User || mongoose.model('User', userSchema);
