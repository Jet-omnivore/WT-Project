// middleware/auth.js — JWT authentication middleware
// Checks if the request has a valid token before allowing access
const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
  // Get token from the Authorization header
  const authHeader = req.header('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, access denied' })
  }

  const token = authHeader.split(' ')[1]

  try {
    // Verify token and attach user data to request
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ message: 'Token is invalid or expired' })
  }
}

module.exports = auth
