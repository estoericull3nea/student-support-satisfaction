import express from 'express'
import {
  getFeedbackStats,
  getUserRegistrationStats,
} from '../controllers/analytics.controller.js'

const router = express.Router()

router.get('/user-registration-stats', getUserRegistrationStats)
router.get('/feedback-stats', getFeedbackStats)

export default router
