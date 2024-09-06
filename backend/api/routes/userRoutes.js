import express from 'express'
import {
  deleteUser,
  getAllUsers,
  loginUser,
  registerUser,
  updateUser,
} from '../controllers/userController.js'
const router = express.Router()

router.get('/', getAllUsers)
router.post('/register', registerUser)
router.post('/login', loginUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

export default router
