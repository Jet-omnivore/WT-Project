// models/User.js — User schema for authentication
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['patient', 'caregiver'],
    default: 'patient'
  }
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)
