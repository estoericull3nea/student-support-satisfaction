import express from 'express'
import { protect } from '../middlewares/authMiddleware.js'
import {
  createFeedback,
  getFeedbackByService,
} from '../controllers/feedback.controller.js'

const router = express.Router()

router.post('/', protect, createFeedback)

router.get('/:serviceId', protect, getFeedbackByService)

export default router
