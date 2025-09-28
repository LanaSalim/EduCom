const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
  batchName: {
    type: String,
    required: true,
    unique: true
  },
  numberOfStudents: {
    type: Number,
    required: true
  },
  classesPerMonth: {
    type: Number,
    required: true
  },
  course: {
    type: String,
    required: true
  },
  medium: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Fix: Check if model already exists before creating
module.exports = mongoose.models.Batch || mongoose.model('Batch', batchSchema);