import express from 'express'
import { getUserRegistrationStats } from '../controllers/analytics.controller.js'

const router = express.Router()

router.get('/user-registration-stats', getUserRegistrationStats)

export default router
