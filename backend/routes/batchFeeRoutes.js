const express = require('express');
const router = express.Router();
const BatchFee = require('../models/BatchFee');
const Batch = require('../models/Batch');
const FeeStructure = require('../models/FeeStructure');

// Create batch fee
router.post('/', async (req, res) => {
  try {
    const batchFee = new BatchFee(req.body);
    await batchFee.save();
    
    // Populate references for the response
    await batchFee.populate('batchId feeStructureId');
    
    res.status(201).json(batchFee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all batch fees
router.get('/', async (req, res) => {
  try {
    const batchFees = await BatchFee.find()
      .populate('batchId')
      .populate('feeStructureId');
    res.json(batchFees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;