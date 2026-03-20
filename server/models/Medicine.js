// models/Medicine.js — Medicine schema
const mongoose = require('mongoose')

const medicineSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  dose: {
    type: String,
    required: true
  },
  frequency: {
    type: String,
    enum: ['Daily', 'Twice Daily', 'Weekly'],
    default: 'Daily'
  },
  time: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active'
  }
}, { timestamps: true })

module.exports = mongoose.model('Medicine', medicineSchema)
