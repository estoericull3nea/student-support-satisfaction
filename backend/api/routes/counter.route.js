import express from 'express'
import {
  getStats,
  getTopFeedbackServices,
  getTopTenRecentUsers,
} from '../controllers/counter.controller.js'

const router = express.Router()

router.get('/stats', getStats)
router.get('/top-service-feedbacks', getTopFeedbackServices)
router.get('/top-ten-users', getTopTenRecentUsers)

export default router
