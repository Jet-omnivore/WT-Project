// routes/auth.js — Register and Login API routes
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const auth = require('../middleware/auth')

const router = express.Router()

// POST /api/auth/register — Create a new user account
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' })
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create new user
    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      role: role || 'patient'
    })

    await user.save()

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, fullName: user.fullName },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role }
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// POST /api/auth/login — Login with email and password
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    // Compare password with hashed password in database
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, fullName: user.fullName },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role }
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// GET /api/auth/me — Get current logged-in user info
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// PUT /api/auth/profile — Update current user's profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { fullName, role } = req.body
    const updates = {}
    if (fullName) updates.fullName = fullName.trim()
    if (role && ['patient', 'caregiver'].includes(role)) updates.role = role

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({
      message: 'Profile updated successfully',
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role }
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

module.exports = router
