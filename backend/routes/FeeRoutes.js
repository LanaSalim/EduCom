const express = require('express');
const router = express.Router();
const FeeStructure = require('../models/FeeStructure');

// Create fee structure
router.post('/', async (req, res) => {
  try {
    const feeStructure = new FeeStructure(req.body);
    await feeStructure.save();
    res.status(201).json(feeStructure);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all fee structures
router.get('/', async (req, res) => {
  try {
    const feeStructures = await FeeStructure.find();
    res.json(feeStructures);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;