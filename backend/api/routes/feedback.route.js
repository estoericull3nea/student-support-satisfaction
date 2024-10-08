import express from 'express'
import { protect } from '../middlewares/authMiddleware.js'
import {
  clearAllFeedbacks,
  createFeedback,
  getAllFeedbacks,
  getAllFeedbacksByService,
  getAllFeedbacksByUserId,
  getFeedbackByService,
} from '../controllers/feedback.controller.js'

const router = express.Router()

router.post('/', protect, createFeedback)
router.get('/', getAllFeedbacks)
router.get('/:userId', getAllFeedbacksByUserId)
router.get('/get-service/:serviceName', getAllFeedbacksByService)
router.delete('/clear-feedbacks', clearAllFeedbacks)

router.get('/service/:serviceId', getFeedbackByService)

export default router
