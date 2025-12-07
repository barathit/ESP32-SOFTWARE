const express = require('express');
const router = express.Router();
const TelemetryReading = require('../models/TelemetryReading');
const Fighter = require('../models/Fighter');
const PreRescue = require('../models/PreRescue');
const { calculateStatus } = require('../utils/statusCalculator');

// @route   POST /api/telemetry
// @desc    Receive ESP32 telemetry data
// @access  Public (can be secured with API key in production)
router.post('/telemetry', async (req, res) => {
  try {
    const esp32Data = req.body;

    // Validate ESP32 data structure
    if (!esp32Data.i || !esp32Data.i.id) {
      return res.status(400).json({ message: 'Invalid ESP32 data format. Missing device ID.' });
    }

    const deviceId = esp32Data.i.id;

    // Find fighter by device ID
    const fighter = await Fighter.findOne({ deviceId, isActive: true });
    if (!fighter) {
      return res.status(404).json({ message: `Fighter not found for device ID: ${deviceId}` });
    }

    // Find active operation for this fighter
    const activeOperation = await PreRescue.findOne({
      'fighters.deviceId': deviceId,
      status: 'active',
    }).sort({ startTime: -1 });

    if (!activeOperation) {
      return res.status(404).json({ message: 'No active operation found for this device' });
    }

    // Extract telemetry data
    const w = esp32Data.w || {};
    const s = esp32Data.s || {};

    const heartRate = w.hr || 0;
    const spO2 = w.sp || 0;
    const temperature = w.tp || 0;
    const altitude = w.al || 0;
    const accelX = w.mx || 0;
    const accelY = w.my || 0;
    const accelZ = w.mz || 0;
    const methane = s.m2 || 0;
    const co = s.m7 || 0;

    // Get last telemetry reading to check accelerometer activity
    const lastReading = await TelemetryReading.findOne({
      deviceId,
      operationId: activeOperation.operationId,
    }).sort({ timestamp: -1 });

    let lastAccelTime = lastReading?.lastAccelTime;
    
    // Check if accelerometer is active (movement detected)
    const accelMagnitude = Math.sqrt(accelX ** 2 + accelY ** 2 + accelZ ** 2);
    if (accelMagnitude > 0.5) { // Threshold for movement detection
      lastAccelTime = new Date();
    } else if (lastReading) {
      lastAccelTime = lastReading.lastAccelTime;
    }

    // Calculate status
    const status = calculateStatus(
      {
        hr: heartRate,
        sp: spO2,
        tp: temperature,
        m2: methane,
        m7: co,
      },
      lastAccelTime
    );

    // Create telemetry reading
    const telemetryReading = new TelemetryReading({
      deviceId,
      fighterId: fighter.fighterId,
      operationId: activeOperation.operationId,
      heartRate,
      spO2,
      temperature,
      altitude,
      accelX,
      accelY,
      accelZ,
      lastAccelTime,
      methane,
      co,
      status,
      rawData: esp32Data,
    });

    await telemetryReading.save();

    // Emit real-time update via Socket.IO (will be handled in server.js)
    req.io.emit('telemetry_update', {
      deviceId,
      fighterId: fighter.fighterId,
      operationId: activeOperation.operationId,
      status,
      heartRate,
      spO2,
      temperature,
      timestamp: telemetryReading.timestamp,
    });

    res.json({
      message: 'Telemetry data received',
      status,
      readingId: telemetryReading._id,
    });
  } catch (error) {
    console.error('Telemetry error:', error);
    res.status(500).json({ message: 'Server error processing telemetry' });
  }
});

module.exports = router;

