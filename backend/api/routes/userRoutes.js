import express from 'express'
import {
  deleteUser,
  getAllUsers,
  getUserById,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
} from '../controllers/userController.js'
import { protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', protect, logoutUser)

router.get('/', protect, getAllUsers)
router.get('/:id', protect, getUserById)

router.put('/:id', protect, updateUser)

router.delete('/:id', protect, deleteUser)

export default router
