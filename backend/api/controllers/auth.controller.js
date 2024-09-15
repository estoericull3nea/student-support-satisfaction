import Blacklist from '../models/blacklist.model.js'
import User from '../models/user.model.js'

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import crypto from 'crypto'

import { validationResult } from 'express-validator'
import { logLogin } from '../middlewares/logLogin.js'

const MAX_FAILED_ATTEMPTS = 5
const LOCK_TIME = 15 * 60 * 1000 // 15 minutes

dotenv.config()

// ================================== Transporter for Sending Email ==================================
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587, // or 465 for SSL
  secure: false, // true for SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

// ================================== Function to Register User ==================================
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
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 8 characters long' })
    }

    // Hash the password asynchronously
    const hashedPassword = await bcrypt.hash(password, 10)

    // Generate a JWT token for email verification
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '15m',
    })

    // Create user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationToken,
      verificationTokenExpires: Date.now() + 15 * 60 * 1000, // 15 minutes
      lastVerificationRequest: Date.now(),
      verificationRequestCount: 1,
    })

    await newUser.save()

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

// ================================== Function to Verify User Email ==================================
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
    user.verificationToken = undefined
    user.verificationTokenExpires = undefined
    await user.save()

    return res.status(200).json({ message: 'Email verified successfully' })
  } catch (error) {
    return res.status(400).json({ message: 'Invalid or expired token' })
  }
}

// ================================== Function to resend verification email ==================================
export const resendVerificationEmail = async (req, res) => {
  const { email } = req.body

  try {
    const user = await User.findOne({ email })

    // If no user
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Check if the user is already verified
    if (user.isVerified) {
      return res.status(400).json({ message: 'User is already verified' })
    }

    const maxRequestsPerDay = 5
    const cooldownPeriod = 5 * 60 * 1000 // 5 minutes
    const dayInMilliseconds = 24 * 60 * 60 * 1000 // 24 hours

    // Check if more than 24 hours have passed since the last request
    if (Date.now() - user.lastVerificationRequest >= dayInMilliseconds) {
      // Reset the request count if more than a day has passed
      user.verificationRequestCount = 0
    }

    // Check if the user has requested a verification email recently (cooldown of 5 minutes)
    if (Date.now() - user.lastVerificationRequest < cooldownPeriod) {
      return res.status(429).json({
        message:
          'Please wait 5 minutes before requesting a new verification email',
      })
    }

    // Check if the user has exceeded the number of verification requests for today
    if (user.verificationRequestCount >= maxRequestsPerDay) {
      return res.status(429).json({
        message:
          'You have exceeded the number of verification requests for today',
      })
    }

    // Generate a new verification token
    const verificationToken = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '15m' } // 15 minutes expiration
    )

    // Update the user's verification token and request count
    user.verificationToken = verificationToken
    user.verificationTokenExpires = Date.now() + 15 * 60 * 1000 // 15 minutes from now
    user.lastVerificationRequest = Date.now()
    user.verificationRequestCount += 1

    await user.save()

    // Send the verification email
    const verificationUrl = `http://localhost:5173/verify?token=${verificationToken}`
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Verify your email',
      html: `
      <p>Dear ${user.firstName},</p>
      <p>Please verify your email by clicking the link below:</p>
      <p><a href="${verificationUrl}">Verify Email</a></p>
      <p>This link will expire in 15 minutes. If you do not verify your email within this time, you will need to request a new confirmation link.</p>
      <p>If you have any questions or need further assistance, please do not hesitate to contact us <a href="${process.env.FRONTEND_URL}contact-us">here</a>.</p>
      <p>Best regards,<br>UCS | ALDCS</p>
      `,
    })

    res.status(200).json({
      message: 'Verification email sent successfully.',
      verificationToken,
    })
  } catch (error) {
    return res.status(500).json({ message: 'Server error: ' + error.message })
  }
}

// ================================== Function to Login User ==================================
export const loginUser = async (req, res) => {
  const { email, password } = req.body

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields required' })
    }

    const thisUser = await User.findOne({ email })

    if (!thisUser) {
      return res.status(404).json({ message: 'User not found with this email' })
    }

    if (!thisUser.isVerified) {
      return res
        .status(403)
        .json({ message: 'Please verify your account before logging in.' })
    }

    const isLocked = thisUser.lockUntil && thisUser.lockUntil > Date.now()
    if (isLocked) {
      const lockDuration = Math.ceil(
        (thisUser.lockUntil - Date.now()) / 1000 / 60
      )
      return res.status(403).json({
        message: `Too many failed login attempts. Try again in ${lockDuration} minutes.`,
      })
    }

    const isPasswordCorrect = await bcrypt.compare(password, thisUser.password)

    if (!isPasswordCorrect) {
      thisUser.failedLoginAttempts += 1

      if (thisUser.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        thisUser.lockUntil = Date.now() + LOCK_TIME // Lock the account for 15 minutes
      }

      await thisUser.save()

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
      {
        id: thisUser._id,
        email: thisUser.email,
        firstName: thisUser.firstName,
        lastName: thisUser.lastName,
        role: thisUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    // Loger
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

// ================================== Function Forgot Password ==================================
export const forgotPassword = async (req, res) => {
  const { email } = req.body

  try {
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ message: 'No user found with this email' })
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message:
          'Your account is not verified. Please verify your account first',
      })
    }

    const resetToken = crypto.randomBytes(32).toString('hex')

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

    const mailOptions = {
      from: process.env.EMAIL_USER,
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

// ================================== Function to Logout User ==================================
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

// ================================== Function to Reset Password ==================================
export const resetPassword = async (req, res) => {
  const { resetToken } = req.params
  const { password } = req.body

  try {
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 8 characters long' })
    }

    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    user.password = hashedPassword
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined

    await user.save()

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset Confirmation',
      html: `
        <p>Dear ${user.firstName},</p>
        <p>We are pleased to inform you that your password has been successfully reset.</p>
        <p>For security reasons, we recommend following these tips when creating a password in the future:</p>
        <ul>
          <li>Use at least 8 characters, including uppercase, lowercase letters, numbers, and special symbols.</li>
          <li>Avoid common words or easily guessable information like your name or birthdate.</li>
          <li>Consider using a passphrase or a combination of random words.</li>
          <li>Update your password regularly to ensure the safety of your account.</li>
        </ul>
        <p>If you have any questions or need further assistance, feel free to reach out to us <a href="${process.env.FRONTEND_URL}/contact-us">here</a>.</p>
        <p>Best regards,<br>Urbiztondo Catholic School | ALDCS Team</p>
      `,
    })

    return res
      .status(200)
      .json({ message: 'Password has been reset successfully' })
  } catch (error) {
    return res.status(500).json({ message: 'Server error: ' + error.message })
  }
}
