const mongoose = require('mongoose');

const localProductSchema = new mongoose.Schema({
  product_name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  producer_name: {
    type: String,
    required: true,
    trim: true
  },
  producer_contact: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    min: 0
  },
  stock_quantity: {
    type: Number,
    min: 0,
    default: 0
  },
  images: [{
    type: String,
    trim: true
  }],
  certification_status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'expired'],
    default: 'pending'
  },
  is_featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for performance
localProductSchema.index({ category: 1 });
localProductSchema.index({ producer_name: 1 });
localProductSchema.index({ certification_status: 1 });
localProductSchema.index({ is_featured: 1 });

module.exports = mongoose.model('LocalProduct', localProductSchema);