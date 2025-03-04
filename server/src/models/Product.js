const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  image: {
    type: String
  },
  features: {
    type: [String],
    default: []
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    trim: true
  },
  specifications: {
    type: Map,
    of: String,
    default: {}
  },
  price: {
    type: Number
  },
  inStock: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', ProductSchema);