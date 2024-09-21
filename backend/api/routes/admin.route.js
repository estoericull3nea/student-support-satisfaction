import express from 'express'
import {
  getAdmin,
  getAllAdmins,
  registerAdmin,
  updateAdmin,
} from '../controllers/admin.controller.js'

const router = express.Router()
router.post('/register', registerAdmin)
router.get('/get-all-admins', getAllAdmins)
router.get('/single-admin', getAdmin)

router.put('/update-admin/:id', updateAdmin)

export default router
