import express from 'express'
import {
  deleteAllUsers,
  deleteUserById,
  getAllUsers,
  getUserById,
  updateUserById,
} from '../controllers/user.controller.js'
import { protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', protect, getAllUsers)
router.get('/:id', protect, getUserById)

router.delete('/', protect, deleteAllUsers)

router.put('/:id', protect, updateUserById)

router.delete('/:id', protect, deleteUserById)

export default router
