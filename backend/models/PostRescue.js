const mongoose = require('mongoose');

const postRescueSchema = new mongoose.Schema({
  operationId: {
    type: String,
    required: true,
    unique: true,
    ref: 'PreRescue',
  },
  commandoId: {
    type: String,
    ref: 'Commando',
    required: true,
  },
  endTime: {
    type: Date,
    default: Date.now,
  },
  duration: {
    type: Number, // in seconds
  },
  casualties: {
    type: Number,
    default: 0,
  },
  rescued: {
    type: Number,
    default: 0,
  },
  notes: {
    type: String,
    trim: true,
  },
  uploadedToCloud: {
    type: Boolean,
    default: false,
  },
  uploadedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('PostRescue', postRescueSchema);

