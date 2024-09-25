import express from 'express'
import {
  getAdminById,
  getAllAdmins,
  registerAdmin,
  updateAdminById,
} from '../controllers/admin.controller.js'

const router = express.Router()

router.post('/register', registerAdmin)
router.get('/get-all-admins', getAllAdmins)
router.get('/single-admin', getAdminById)

router.put('/update-admin/:id', updateAdminById)

export default router
