const mongoose = require('mongoose');

const telemetryReadingSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    index: true,
  },
  fighterId: {
    type: String,
    ref: 'Fighter',
    required: true,
    index: true,
  },
  operationId: {
    type: String,
    ref: 'PreRescue',
    required: true,
    index: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
  // Health metrics
  heartRate: {
    type: Number,
    required: true,
  },
  spO2: {
    type: Number,
    required: true,
  },
  temperature: {
    type: Number,
    required: true,
  },
  altitude: {
    type: Number,
  },
  // Accelerometer data
  accelX: {
    type: Number,
  },
  accelY: {
    type: Number,
  },
  accelZ: {
    type: Number,
  },
  lastAccelTime: {
    type: Date,
  },
  // Gas sensors
  methane: {
    type: Number, // m2
  },
  co: {
    type: Number, // m7
  },
  // Computed status
  status: {
    type: String,
    enum: ['normal', 'need_attention', 'emergency'],
    required: true,
    index: true,
  },
  // Raw ESP32 JSON
  rawData: {
    type: mongoose.Schema.Types.Mixed,
  },
}, {
  timestamps: true,
});

// Indexes for efficient queries
telemetryReadingSchema.index({ operationId: 1, timestamp: -1 });
telemetryReadingSchema.index({ fighterId: 1, timestamp: -1 });

module.exports = mongoose.model('TelemetryReading', telemetryReadingSchema);

