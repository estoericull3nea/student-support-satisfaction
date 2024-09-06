import express from 'express'
import {
  deleteUser,
  getAllUsers,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
} from '../controllers/userController.js'
import { protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', protect, getAllUsers)
router.post('/register', registerUser)
router.post('/login', loginUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)
router.post('/logout', protect, logoutUser)

export default router
