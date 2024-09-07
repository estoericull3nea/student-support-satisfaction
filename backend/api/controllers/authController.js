import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Blacklist from '../models/Blacklist.js'
import User from '../models/User.js'
import { validationResult } from 'express-validator'

// Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body

  try {
    // All fields are required
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields required' })
    }

    // Find the user by email
    const thisUser = await User.findOne({ email })

    // Check if the user exists
    if (!thisUser) {
      return res.status(404).json({ message: 'User not found with this email' })
    }

    // Compare the password using bcrypt (asynchronously)
    const isPasswordCorrect = await bcrypt.compare(password, thisUser.password)

    // Check if the password is correct
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Incorrect Email or Password' })
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: thisUser._id, email: thisUser.email },
      process.env.JWT_SECRET, // Secret key from environment variable
      { expiresIn: '1h' } // Token expiration time
    )

    // Return a success message and user info (without password)
    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: thisUser._id,
        firstName: thisUser.firstName,
        lastName: thisUser.lastName,
        email: thisUser.email,
      },
    })
  } catch (error) {
    return res.status(500).json({ message: 'Server error: ' + error.message })
  }
}

// Registering User
export const registerUser = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { firstName, lastName, email, password } = req.body

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ message: 'User Already Exists' })
    }

    // Hash the password asynchronously
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create a new user instance
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    })

    // Save the user to the database
    await newUser.save()

    // Return success response
    return res.status(201).json({
      message: 'User Registered Successfully',
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      },
    })
  } catch (error) {
    return res.status(500).json({ message: 'Server Error: ' + error.message })
  }
}

// Logout User
export const logoutUser = async (req, res) => {
  try {
    // Cleanup expired tokens before logging out
    await Blacklist.deleteMany({ expiresAt: { $lt: new Date() } })

    // Extract the token from the authorization header
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(400).json({ message: 'No token provided' })
    }

    // Decode the token to get the expiration time
    const decoded = jwt.decode(token)

    if (!decoded) {
      return res.status(400).json({ message: 'Invalid token' })
    }

    // Check if the token is already blacklisted
    const blacklisted = await Blacklist.findOne({ token })

    if (blacklisted) {
      return res.status(400).json({ message: 'Token is already invalidated' })
    }

    // Save the token in the blacklist with the expiration time
    const blacklistedToken = new Blacklist({
      token,
      expiresAt: new Date(decoded.exp * 1000), // Convert from seconds to milliseconds
    })

    await blacklistedToken.save()

    return res
      .status(200)
      .json({ message: 'Logout successful, token invalidated' })
  } catch (error) {
    return res.status(500).json({ message: 'Server error: ' + error.message })
  }
}
