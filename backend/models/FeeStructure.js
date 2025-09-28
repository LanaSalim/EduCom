const mongoose = require('mongoose');

const feeStructureSchema = new mongoose.Schema({
  feeStructureName: {
    type: String,
    required: true
  },
  minStudents: {
    type: Number, 
    required: true
  },
  maxStudents: {
    type: Number,
    required: true
  },
  region: {
    type: String,
    required: true
  },
  medium: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true
  },
  monthlyFee: {
    type: Number,
    required: true
  },
  totalClasses: {
    type: Number,
    required: true
  },
  remarks: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.FeeStructure || mongoose.model('FeeStructure', feeStructureSchema);