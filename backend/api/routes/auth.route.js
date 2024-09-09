// routes/authRoutes.js (or similar route file)
import express from 'express'
import {
  loginUser,
  logoutUser,
  registerUser,
  verifyEmail,
} from '../controllers/auth.controller.js'
import { protect } from '../middlewares/authMiddleware.js'
import { validateUserRegistration } from '../middlewares/validators.js' // Import the validator

const router = express.Router()

router.post('/register', validateUserRegistration, registerUser) // Apply validation middleware
router.post('/login', loginUser)
router.post('/logout', protect, logoutUser)

router.get('/verify', verifyEmail)

export default router
