// server.js — Main Express server entry point
const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')

// Load environment variables from .env file
dotenv.config()

// Connect to MongoDB
connectDB()

const app = express()

// Middleware
app.use(cors())                    // Allow frontend to make requests
app.use(express.json())            // Parse JSON request bodies

// API Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/medicines', require('./routes/medicines'))
app.use('/api/appointments', require('./routes/appointments'))

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'MediRemind API is running' })
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
