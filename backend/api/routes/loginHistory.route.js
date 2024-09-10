// routes/authRoutes.js (or similar route file)
import express from 'express'
import {
  clearLoginHistory,
  deleteLoginHistoryById,
  getAllLogins,
  getLoginHistoryById,
} from '../controllers/loginHistory.controller.js'

const router = express.Router()

router.get('/', getAllLogins)
router.delete('/', clearLoginHistory)
router.get('/:id', getLoginHistoryById)
router.delete('/:id', deleteLoginHistoryById)

export default router
