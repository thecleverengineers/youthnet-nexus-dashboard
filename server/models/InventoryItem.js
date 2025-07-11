const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  model: {
    type: String,
    trim: true
  },
  serial_number: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },
  location: {
    type: String,
    trim: true
  },
  purchase_date: {
    type: Date
  },
  purchase_price: {
    type: Number,
    min: 0
  },
  current_value: {
    type: Number,
    min: 0
  },
  status: {
    type: String,
    enum: ['available', 'in_use', 'maintenance', 'damaged', 'disposed'],
    default: 'available'
  },
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for performance
inventoryItemSchema.index({ category: 1 });
inventoryItemSchema.index({ status: 1 });
inventoryItemSchema.index({ assigned_to: 1 });

module.exports = mongoose.model('InventoryItem', inventoryItemSchema);