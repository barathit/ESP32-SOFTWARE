const express = require('express');
const router = express.Router();
const { commandoAuth } = require('../middleware/auth');
const PreRescue = require('../models/PreRescue');
const PostRescue = require('../models/PostRescue');
const Fighter = require('../models/Fighter');

// @route   POST /api/pre-rescue
// @desc    Start a rescue operation
// @access  Private (Commando)
router.post('/pre-rescue', commandoAuth, async (req, res) => {
  try {
    const { location, operationType, description, fighters } = req.body;

    if (!location || !operationType || !fighters || !Array.isArray(fighters) || fighters.length === 0) {
      return res.status(400).json({ message: 'Missing required fields: location, operationType, fighters' });
    }

    // Generate unique operation ID
    const operationId = `OP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Validate fighters and devices
    const validatedFighters = [];
    for (const fighter of fighters) {
      if (!fighter.fighterId || !fighter.deviceId) {
        return res.status(400).json({ message: 'Each fighter must have fighterId and deviceId' });
      }

      const fighterDoc = await Fighter.findOne({
        fighterId: fighter.fighterId,
        isActive: true,
      });

      if (!fighterDoc) {
        return res.status(404).json({ message: `Fighter not found: ${fighter.fighterId}` });
      }

      // Check if device is already in an active operation
      const activeOp = await PreRescue.findOne({
        'fighters.deviceId': fighter.deviceId,
        status: 'active',
      });

      if (activeOp) {
        return res.status(400).json({ message: `Device ${fighter.deviceId} is already in an active operation` });
      }

      validatedFighters.push({
        fighterId: fighter.fighterId,
        deviceId: fighter.deviceId,
      });
    }

    // Get commando ID from user or request
    const commandoId = req.body.commandoId || req.user.commandoId || 'COMMANDO-' + req.user.userId;

    const preRescue = new PreRescue({
      operationId,
      commandoId,
      location,
      operationType,
      description,
      fighters: validatedFighters,
      status: 'active',
    });

    await preRescue.save();

    // Emit operation started event
    req.io.emit('operation_started', {
      operationId,
      commandoId,
      fighters: validatedFighters,
    });

    res.status(201).json({
      message: 'Rescue operation started',
      operation: preRescue,
    });
  } catch (error) {
    console.error('Pre-rescue error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/post-rescue
// @desc    End a rescue operation
// @access  Private (Commando)
router.post('/post-rescue', commandoAuth, async (req, res) => {
  try {
    const { operationId, casualties, rescued, notes } = req.body;

    if (!operationId) {
      return res.status(400).json({ message: 'Operation ID is required' });
    }

    // Find active operation
    const operation = await PreRescue.findOne({
      operationId,
      status: 'active',
    });

    if (!operation) {
      return res.status(404).json({ message: 'Active operation not found' });
    }

    // Calculate duration
    const endTime = new Date();
    const duration = Math.floor((endTime - operation.startTime) / 1000);

    // Update operation status
    operation.status = 'completed';
    await operation.save();

    // Create post-rescue record
    const postRescue = new PostRescue({
      operationId,
      commandoId: operation.commandoId,
      endTime,
      duration,
      casualties: casualties || 0,
      rescued: rescued || 0,
      notes: notes || '',
    });

    await postRescue.save();

    // Emit operation ended event
    req.io.emit('operation_ended', {
      operationId,
      duration,
    });

    res.json({
      message: 'Rescue operation ended',
      postRescue,
    });
  } catch (error) {
    console.error('Post-rescue error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/upload-operation/:id
// @desc    Mark operation as uploaded to cloud
// @access  Private (Commando)
router.post('/upload-operation/:id', commandoAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const postRescue = await PostRescue.findOne({ operationId: id });
    if (!postRescue) {
      return res.status(404).json({ message: 'Operation not found' });
    }

    postRescue.uploadedToCloud = true;
    postRescue.uploadedAt = new Date();
    await postRescue.save();

    res.json({
      message: 'Operation marked as uploaded to cloud',
      postRescue,
    });
  } catch (error) {
    console.error('Upload operation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/rescue/active
// @desc    Get active operations
// @access  Private (Commando)
router.get('/active', commandoAuth, async (req, res) => {
  try {
    const operations = await PreRescue.find({ status: 'active' })
      .sort({ startTime: -1 })
      .populate('fighters.fighterId', 'name fighterId');

    res.json(operations);
  } catch (error) {
    console.error('Get active operations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/rescue/:operationId
// @desc    Get operation details
// @access  Private (Commando)
router.get('/:operationId', commandoAuth, async (req, res) => {
  try {
    const { operationId } = req.params;

    const operation = await PreRescue.findOne({ operationId });
    if (!operation) {
      return res.status(404).json({ message: 'Operation not found' });
    }

    res.json(operation);
  } catch (error) {
    console.error('Get operation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

