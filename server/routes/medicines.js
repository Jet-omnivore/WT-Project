// routes/medicines.js — CRUD API for medicines
const express = require('express')
const Medicine = require('../models/Medicine')
const auth = require('../middleware/auth')

const router = express.Router()

// All routes below require authentication
router.use(auth)

// GET /api/medicines — Get all medicines for the logged-in user
router.get('/', async (req, res) => {
  try {
    const medicines = await Medicine.find({ userId: req.user.id }).sort({ createdAt: -1 })
    res.json(medicines)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// POST /api/medicines — Add a new medicine
router.post('/', async (req, res) => {
  try {
    const { name, dose, frequency, time, notes, status } = req.body

    const medicine = new Medicine({
      userId: req.user.id,
      name,
      dose,
      frequency,
      time,
      notes,
      status
    })

    await medicine.save()
    res.status(201).json(medicine)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// PUT /api/medicines/:id — Update a medicine
router.put('/:id', async (req, res) => {
  try {
    const medicine = await Medicine.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    )

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' })
    }

    res.json(medicine)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// DELETE /api/medicines/:id — Delete a medicine
router.delete('/:id', async (req, res) => {
  try {
    const medicine = await Medicine.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    })

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' })
    }

    res.json({ message: 'Medicine deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

module.exports = router
