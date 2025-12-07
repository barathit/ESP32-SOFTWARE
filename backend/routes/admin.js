const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const User = require('../models/User');
const Commando = require('../models/Commando');
const Fighter = require('../models/Fighter');
const PreRescue = require('../models/PreRescue');
const PostRescue = require('../models/PostRescue');
const TelemetryReading = require('../models/TelemetryReading');

// @route   POST /api/admin/commando
// @desc    Register a new commando
// @access  Private (Admin)
router.post('/commando', adminAuth, async (req, res) => {
  try {
    // Trim all input values
    const commandoId = req.body.commandoId?.trim();
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const phone = req.body.phone?.trim();
    const password = req.body.password?.trim();

    console.log('Registration request:', { commandoId, name, email, phone, hasPassword: !!password });

    // Better validation with specific error messages
    const missingFields = [];
    if (!commandoId) missingFields.push('commandoId');
    if (!name) missingFields.push('name');
    if (!email) missingFields.push('email');
    if (!password) missingFields.push('password');

    if (missingFields.length > 0) {
      console.log('Missing fields:', missingFields);
      return res.status(400).json({ 
        message: `Missing required fields: ${missingFields.join(', ')}`,
        missingFields 
      });
    }

    // Check if commando ID already exists
    const existingCommando = await Commando.findOne({ commandoId });
    if (existingCommando) {
      return res.status(400).json({ message: 'Commando ID already exists' });
    }

    // Use commandoId as username
    const username = commandoId;

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Commando ID already exists as username' });
    }

    // Create user account with commandoId as username
    const user = new User({
      username: commandoId,
      email,
      password,
      role: 'commando',
    });
    await user.save();
    console.log('User created:', user.username);

    // Create commando profile
    const commando = new Commando({
      commandoId,
      name,
      email,
      phone: phone || undefined,
      userId: user._id,
    });
    await commando.save();
    console.log('Commando created:', commando.commandoId);

    res.status(201).json({
      message: 'Commando registered successfully',
      commando: {
        commandoId: commando.commandoId,
        name: commando.name,
        email: commando.email,
        userId: user._id,
        loginUsername: commandoId,
      },
      loginCredentials: {
        username: commandoId,
        password: 'Password set during registration',
        note: 'Use Commando ID as username to login',
      },
    });
  } catch (error) {
    console.error('Register commando error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/commando/:id
// @desc    Update commando
// @access  Private (Admin)
router.put('/commando/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, isActive } = req.body;

    const commando = await Commando.findOne({ commandoId: id });
    if (!commando) {
      return res.status(404).json({ message: 'Commando not found' });
    }

    if (name) commando.name = name;
    if (email) commando.email = email;
    if (phone) commando.phone = phone;
    if (typeof isActive === 'boolean') commando.isActive = isActive;

    await commando.save();

    res.json({
      message: 'Commando updated successfully',
      commando,
    });
  } catch (error) {
    console.error('Update commando error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/admin/commando/:id
// @desc    Delete commando
// @access  Private (Admin)
router.delete('/commando/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const commando = await Commando.findOne({ commandoId: id });
    if (!commando) {
      return res.status(404).json({ message: 'Commando not found' });
    }

    // Deactivate instead of delete
    commando.isActive = false;
    await commando.save();

    // Deactivate user account
    await User.findByIdAndUpdate(commando.userId, { isActive: false });

    res.json({ message: 'Commando deactivated successfully' });
  } catch (error) {
    console.error('Delete commando error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/commandos
// @desc    Get all commandos
// @access  Private (Admin)
router.get('/commandos', adminAuth, async (req, res) => {
  try {
    const commandos = await Commando.find()
      .populate('userId', 'username email')
      .sort({ createdAt: -1 });

    res.json(commandos);
  } catch (error) {
    console.error('Get commandos error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/admin/map-device
// @desc    Map ESP32 device to fighter
// @access  Private (Admin)
router.post('/map-device', adminAuth, async (req, res) => {
  try {
    const { fighterId, deviceId } = req.body;

    if (!fighterId || !deviceId) {
      return res.status(400).json({ message: 'Fighter ID and Device ID are required' });
    }

    const fighter = await Fighter.findOne({ fighterId });
    if (!fighter) {
      return res.status(404).json({ message: 'Fighter not found' });
    }

    // Check if device is already mapped to another fighter
    const existingMapping = await Fighter.findOne({
      deviceId,
      fighterId: { $ne: fighterId },
    });

    if (existingMapping) {
      return res.status(400).json({
        message: `Device ${deviceId} is already mapped to fighter ${existingMapping.fighterId}`,
      });
    }

    fighter.deviceId = deviceId;
    await fighter.save();

    res.json({
      message: 'Device mapped successfully',
      fighter,
    });
  } catch (error) {
    console.error('Map device error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/search
// @desc    Search by Commando ID or Fighter ID
// @access  Private (Admin)
router.get('/search', adminAuth, async (req, res) => {
  try {
    const { commandoId, fighterId, operationId } = req.query;

    let results = {};

    if (commandoId) {
      const commando = await Commando.findOne({ commandoId });
      if (commando) {
        const operations = await PreRescue.find({ commandoId })
          .sort({ startTime: -1 })
          .limit(10);
        results.commando = commando;
        results.operations = operations;
      }
    }

    if (fighterId) {
      const fighter = await Fighter.findOne({ fighterId });
      if (fighter) {
        const telemetry = await TelemetryReading.find({ fighterId })
          .sort({ timestamp: -1 })
          .limit(50);
        const operations = await PreRescue.find({
          'fighters.fighterId': fighterId,
        })
          .sort({ startTime: -1 })
          .limit(10);
        results.fighter = fighter;
        results.telemetry = telemetry;
        results.operations = operations;
      }
    }

    if (operationId) {
      const operation = await PreRescue.findOne({ operationId });
      if (operation) {
        const telemetry = await TelemetryReading.find({ operationId })
          .sort({ timestamp: -1 });
        const postRescue = await PostRescue.findOne({ operationId });
        results.operation = operation;
        results.telemetry = telemetry;
        results.postRescue = postRescue;
      }
    }

    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/summary
// @desc    Get operation summary and reports
// @access  Private (Admin)
router.get('/summary', adminAuth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const query = {};
    if (startDate || endDate) {
      query.startTime = {};
      if (startDate) query.startTime.$gte = new Date(startDate);
      if (endDate) query.startTime.$lte = new Date(endDate);
    }

    const totalOperations = await PreRescue.countDocuments(query);
    const activeOperations = await PreRescue.countDocuments({ ...query, status: 'active' });
    const completedOperations = await PreRescue.countDocuments({ ...query, status: 'completed' });

    const totalCommandos = await Commando.countDocuments({ isActive: true });
    const totalFighters = await Fighter.countDocuments({ isActive: true });

    const totalTelemetryReadings = await TelemetryReading.countDocuments();
    const emergencyReadings = await TelemetryReading.countDocuments({ status: 'emergency' });
    const attentionReadings = await TelemetryReading.countDocuments({ status: 'need_attention' });

    const recentOperations = await PreRescue.find(query)
      .sort({ startTime: -1 })
      .limit(10)
      .populate('commandoId', 'name commandoId');

    res.json({
      summary: {
        totalOperations,
        activeOperations,
        completedOperations,
        totalCommandos,
        totalFighters,
        totalTelemetryReadings,
        emergencyReadings,
        attentionReadings,
      },
      recentOperations,
    });
  } catch (error) {
    console.error('Summary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/operations
// @desc    Get all operations with details
// @access  Private (Admin)
router.get('/operations', adminAuth, async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;
    const query = {};
    if (status) query.status = status;

    const operations = await PreRescue.find(query)
      .sort({ startTime: -1 })
      .limit(parseInt(limit))
      .lean();

    // Get post-rescue data and telemetry counts for each operation
    const operationsWithDetails = await Promise.all(
      operations.map(async (op) => {
        const postRescue = await PostRescue.findOne({ operationId: op.operationId });
        const telemetryCount = await TelemetryReading.countDocuments({ operationId: op.operationId });
        const emergencyCount = await TelemetryReading.countDocuments({
          operationId: op.operationId,
          status: 'emergency',
        });
        const attentionCount = await TelemetryReading.countDocuments({
          operationId: op.operationId,
          status: 'need_attention',
        });

        return {
          ...op,
          postRescue,
          telemetryCount,
          emergencyCount,
          attentionCount,
          duration: postRescue?.duration || null,
        };
      })
    );

    res.json(operationsWithDetails);
  } catch (error) {
    console.error('Get operations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/telemetry/:operationId
// @desc    Get telemetry history for an operation
// @access  Private (Admin)
router.get('/telemetry/:operationId', adminAuth, async (req, res) => {
  try {
    const { operationId } = req.params;
    const { fighterId, limit = 100 } = req.query;

    const query = { operationId };
    if (fighterId) query.fighterId = fighterId;

    const telemetry = await TelemetryReading.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.json(telemetry);
  } catch (error) {
    console.error('Get telemetry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
