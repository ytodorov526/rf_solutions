const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true
  },
  summary: {
    type: String,
    required: [true, 'Project summary is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Project description is required']
  },
  image: {
    type: String
  },
  technologies: {
    type: [String],
    default: []
  },
  category: {
    type: String,
    required: [true, 'Project category is required'],
    trim: true
  },
  results: {
    type: String
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Project', ProjectSchema);