import express from 'express'
import {
  countVisit,
  getAllVisits,
  getVisitById,
  getVisitsByServiceName,
} from '../controllers/visit.controller.js'

const router = express.Router()

router.post('/', countVisit)
router.get('/', getAllVisits)
router.get('/:id', getVisitById)
router.get('/service/:serviceName', getVisitsByServiceName)

export default router
