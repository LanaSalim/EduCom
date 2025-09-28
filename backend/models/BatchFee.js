const mongoose = require('mongoose');

const studentDiscountSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true
  },
  discountCategory: {
    type: String,
    required: true
  },
  discountAmount: {
    type: Number,
    required: true
  },
  monthlyFeeAfterDiscount: {
    type: Number,
    required: true
  }
});

const batchFeeSchema = new mongoose.Schema({
  batchName: {
    type: String,
    required: true
  },
  feeStructureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FeeStructure',
    required: true
  },
  studentDiscounts: [studentDiscountSchema],
  totalMonthlyFee: {
    type: Number,
    required: true
  },
  totalDiscount: {
    type: Number,
    default: 0
  },
  finalFee: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.BatchFee || mongoose.model('BatchFee', batchFeeSchema);