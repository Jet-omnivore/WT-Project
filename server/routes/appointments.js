// routes/appointments.js — CRUD API for appointments
const express = require('express')
const Appointment = require('../models/Appointment')
const auth = require('../middleware/auth')

const router = express.Router()

// All routes below require authentication
router.use(auth)

// GET /api/appointments — Get all appointments for the logged-in user
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user.id }).sort({ createdAt: -1 })
    res.json(appointments)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// POST /api/appointments — Add a new appointment
router.post('/', async (req, res) => {
  try {
    const { doctor, specialty, date, time, clinic, notes, status } = req.body

    const appointment = new Appointment({
      userId: req.user.id,
      doctor,
      specialty,
      date,
      time,
      clinic,
      notes,
      status
    })

    await appointment.save()
    res.status(201).json(appointment)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// PUT /api/appointments/:id — Update an appointment
router.put('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    )

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' })
    }

    res.json(appointment)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// DELETE /api/appointments/:id — Delete an appointment
router.delete('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    })

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' })
    }

    res.json({ message: 'Appointment deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

module.exports = router
