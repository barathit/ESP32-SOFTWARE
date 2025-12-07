const mongoose = require('mongoose');

const preRescueSchema = new mongoose.Schema({
  operationId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  commandoId: {
    type: String,
    ref: 'Commando',
    required: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  operationType: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  fighters: [{
    fighterId: {
      type: String,
      ref: 'Fighter',
      required: true,
    },
    deviceId: {
      type: String,
      required: true,
    },
  }],
  startTime: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('PreRescue', preRescueSchema);

