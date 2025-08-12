import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const blogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String }, // Optional blog cover image
  category: { type: String, enum: ['Food Review', 'Recipe', 'Restaurant Experience', 'Tips & Tricks', 'Other'], default: 'Other' },
  tags: [{ type: String }],
  comments: [commentSchema],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Indexes for performance
blogSchema.index({ userId: 1 });
blogSchema.index({ category: 1 });
blogSchema.index({ createdAt: -1 });
// Compound index for user's blogs
blogSchema.index({ userId: 1, createdAt: -1 });

// Text index for search
blogSchema.index({ 
  title: 'text', 
  content: 'text',
  tags: 'text'
});

export default mongoose.models.Blog || mongoose.model('Blog', blogSchema);
