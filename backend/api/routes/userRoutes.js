import express from 'express'
import {
  deleteAllUsers,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from '../controllers/userController.js'
import { protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', protect, getAllUsers)
router.get('/:id', protect, getUserById)

router.delete('/', protect, deleteAllUsers)

router.put('/:id', protect, updateUser)

router.delete('/:id', protect, deleteUser)

export default router
