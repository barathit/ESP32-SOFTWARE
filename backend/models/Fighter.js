const mongoose = require('mongoose');

const fighterSchema = new mongoose.Schema({
  fighterId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  deviceId: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  commandoId: {
    type: String,
    ref: 'Commando',
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Fighter', fighterSchema);

