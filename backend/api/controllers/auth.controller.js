import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import Blacklist from '../models/blacklist.model.js'
import User from '../models/user.model.js'
import { validationResult } from 'express-validator'
import { logLogin } from '../middlewares/logLogin.js'

dotenv.config()

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587, // or 465 for SSL
  secure: false, // true for SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

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
      isVerified: false,
    })

    // Save the user to the database
    await newUser.save()

    // testing ====================================
    // Generate a JWT token for email verification
    const verificationToken = jwt.sign(
      { email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '15m' } // Set token to expire in 15 minutes
    )

    // Send verification email
    const verificationUrl = `http://localhost:5173/verify?token=${verificationToken}`
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: newUser.email,
      subject: 'Verify your email',
      html: `
      <p>Dear ${newUser.firstName},</p>
      <p>Thank you for registering with us. To complete the registration process, please click on the link below to confirm your email address:</p>
      <p><a href="${verificationUrl}">Confirm Email</a></p>
      <p>This link will expire in 15 minutes. If you do not verify your email within this time, you will need to request a new confirmation link.</p>
      <p>If you have any questions or need further assistance, please do not hesitate to contact us <a href="http://localhost:5173/contact-us">here</a>.</p>
      <p>Best regards,<br>UCS | ALDCS</p>
        `,
    })

    // testing ====================================

    // Return success response
    return res.status(201).json({
      message: 'User Registered Successfully. Verification email sent.',
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

// Email verification route
export const verifyEmail = async (req, res) => {
  const { token } = req.query

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { email } = decoded

    // Find the user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res
        .status(400)
        .json({ message: 'Invalid token or user not found' })
    }

    // Check if the user is already verified
    if (user.isVerified) {
      return res.status(400).json({ message: 'User already verified' })
    }

    // Mark the user as verified
    user.isVerified = true
    await user.save()

    return res.status(200).json({ message: 'Email verified successfully' })
  } catch (error) {
    return res.status(400).json({ message: 'Invalid or expired token' })
  }
}

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

    // Log the login activity
    await logLogin(req, thisUser._id)

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

// Logout User
export const logoutUser = async (req, res) => {
  try {
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
