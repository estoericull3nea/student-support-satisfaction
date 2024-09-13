import express from 'express'
import {
  forgotPassword,
  loginUser,
  logoutUser,
  registerUser,
  resendVerificationEmail,
  resetPassword,
  verifyEmail,
} from '../controllers/auth.controller.js'
import { protect } from '../middlewares/authMiddleware.js'
import { validateUserRegistration } from '../middlewares/validators.js'
import rateLimit from 'express-rate-limit'

const router = express.Router()

// Define rate limit: max 5 requests per minute per IP
const loginLimiter = rateLimit({
  windowMs: 10 * 1000, // 10 seconds window
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many login attempts. Please try again after a minute.',
})

router.post('/register', validateUserRegistration, registerUser)
router.post('/login', loginLimiter, loginUser)
router.post('/logout', protect, logoutUser)

router.get('/verify', verifyEmail)

router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:resetToken', resetPassword)
router.post('/resend-verification', resendVerificationEmail)

export default router
