import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import Blacklist from '../models/blacklist.model.js'
import User from '../models/user.model.js'
import { validationResult } from 'express-validator'
import { logLogin } from '../middlewares/logLogin.js'
import crypto from 'crypto'

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

const MAX_FAILED_ATTEMPTS = 5
const LOCK_TIME = 15 * 60 * 1000 // 15 minutes

export const forgotPassword = async (req, res) => {
  const { email } = req.body

  try {
    // Find the user by email
    const user = await User.findOne({ email })

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: 'No user found with this email' })
    }

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex')

    // Hash the token before saving it to the database for added security
    const hashedResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')

    const resetTokenExpires = Date.now() + 15 * 60 * 1000 // 15 minutes from now

    // Save the hashed token and its expiration in the user's document
    user.resetPasswordToken = hashedResetToken
    user.resetPasswordExpires = resetTokenExpires
    await user.save()

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`

    // Send email with nodemailer
    const mailOptions = {
      from: process.env.EMAIL_USER, // Your email address
      to: user.email,
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset. Click the link below to reset your password:</p>
             <a href="${resetUrl}">Reset Password</a><br />
             <p>This link is valid for 15 minutes.</p>`,
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error)
        return res.status(500).json({ message: 'Error sending email' })
      }

      // Send success response
      res.status(200).json({
        message: 'Password reset link sent to your email',
        resetToken: hashedResetToken,
      })
    })
  } catch (error) {
    console.error('Server error:', error.message)
    return res.status(500).json({ message: 'Server error: ' + error.message })
  }
}

export const resetPassword = async (req, res) => {
  const { resetToken } = req.params // Get the token from the URL
  const { password } = req.body // Destructure only password

  try {
    // Validate password length (minimum 8 characters)
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 8 characters long' })
    }

    // Hash the token received in the URL
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')
    // Find the user by the reset token and check if the token is still valid (not expired)
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }, // Check if token is not expired
    })

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' })
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Update the user's password and clear the reset token fields
    user.password = hashedPassword
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined

    await user.save()

    return res
      .status(200)
      .json({ message: 'Password has been reset successfully' })
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

    // Validate password length (minimum 8 characters)
    // if (password.length < 8) {
    //   return res
    //     .status(400)
    //     .json({ message: 'Password must be at least 8 characters long' })
    // }

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
      <p>If you have any questions or need further assistance, please do not hesitate to contact us <a href="${process.env.FRONTEND_URL}contact-us">here</a>.</p>
      <p>Best regards,<br>UCS | ALDCS</p>
        `,
    })

    // Return success response
    return res.status(201).json({
      message: 'User Registered Successfully. Verification email sent.',
      tokenREST: verificationToken,
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

    // Check if the user is verified
    if (!thisUser.isVerified) {
      return res
        .status(403)
        .json({ message: 'Please verify your account before logging in.' })
    }

    // Check if the user is locked out
    const isLocked = thisUser.lockUntil && thisUser.lockUntil > Date.now()
    if (isLocked) {
      const lockDuration = Math.ceil(
        (thisUser.lockUntil - Date.now()) / 1000 / 60
      ) // Time remaining in minutes
      return res.status(403).json({
        message: `Too many failed login attempts. Try again in ${lockDuration} minutes.`,
      })
    }

    // Compare the password using bcrypt (asynchronously)
    const isPasswordCorrect = await bcrypt.compare(password, thisUser.password)

    if (!isPasswordCorrect) {
      // Increment failed login attempts
      thisUser.failedLoginAttempts += 1

      if (thisUser.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        thisUser.lockUntil = Date.now() + LOCK_TIME // Lock the account for 15 minutes
      }

      await thisUser.save() // Save the updated thisUser data

      return res.status(401).json({
        message:
          thisUser.failedLoginAttempts >= MAX_FAILED_ATTEMPTS
            ? `Too many login attempts. Try again after 15 minutes.`
            : 'Incorrect email or password.',
      })
    }

    // Reset failed login attempts on successful login
    thisUser.failedLoginAttempts = 0
    thisUser.lockUntil = undefined
    await thisUser.save()

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
