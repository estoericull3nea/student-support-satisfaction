import jwt from 'jsonwebtoken'
import Blacklist from '../models/blacklist.model.js'

// ================================== Protecting Routes ==================================
export const protect = async (req, res, next) => {
  // Get the token from headers
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res
      .status(401)
      .json({ message: 'No token provided, authorization denied' })
  }

  try {
    // Check if the token is blacklisted
    const blacklisted = await Blacklist.findOne({ token })

    if (blacklisted) {
      return res.status(401).json({ message: 'Please login first' })
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Attach the user to the request object (from the token payload)
    req.user = decoded

    // Continue to the next middleware or route
    next()
  } catch (error) {
    return res
      .status(401)
      .json({ message: 'Invalid token, authorization denied' })
  }
}
