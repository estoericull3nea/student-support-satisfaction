import express from 'express'
import {
  getFeedbackByServices,
  getFeedbackRatings,
  getFeedbackStats,
  getFeedbackStatsByService,
  getUserRegistrationStats,
} from '../controllers/analytics.controller.js'

const router = express.Router()

router.get('/user-registration-stats', getUserRegistrationStats)
router.get('/feedback-stats', getFeedbackStats)
router.get('/feedback-stats/:serviceName', getFeedbackStatsByService)
router.get('/feedback-services-stats', getFeedbackByServices)

router.get('/ratings/data', getFeedbackRatings)

export default router
