const express = require('express');
const router = express.Router();
const Batch = require('../models/batch');

// Create batch
router.post('/', async (req, res) => {
  try {
    const batch = new Batch(req.body);
    await batch.save();
    res.status(201).json(batch);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all batches
router.get('/', async (req, res) => {
  try {
    const batches = await Batch.find();
    res.json(batches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get batch by ID
router.get('/:id', async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);
    if (!batch) return res.status(404).json({ error: 'Batch not found' });
    res.json(batch);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;