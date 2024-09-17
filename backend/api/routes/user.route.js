import express from 'express'
import {
  deleteAllUsers,
  deleteUserById,
  getAllUsers,
  getUserById,
  updateUserById,
} from '../controllers/user.controller.js'
import { protect } from '../middlewares/authMiddleware.js'

import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import User from '../models/user.model.js'
import { roleMiddleware } from '../middlewares/roleMiddleware.js'

const router = express.Router()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/profile-pics/')
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    const safeFileName = file.originalname.replace(/\s+/g, '-') // Replaces spaces with hyphens
    cb(null, `${Date.now()}-${safeFileName}`)
  },
})

const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = fileTypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb(new Error('Only images (JPG or PNG) are allowed!'))
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter,
})

router.put(
  '/:id/upload-profile-pic',
  protect,
  upload.single('profilePic'),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id)

      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      user.profilePic = `/uploads/profile-pics/${req.file.filename}`
      await user.save()

      res.status(200).json({ profilePic: user.profilePic })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
)

// router.get('/', protect, getAllUsers) real
// router.get('/', protect, roleMiddleware('customer'), getAllUsers) // testing
router.get('/', getAllUsers) // testing
router.get('/:id', protect, getUserById)

// router.delete('/', protect, deleteAllUsers) real
router.delete('/', deleteAllUsers) // testing

router.put('/:id', protect, updateUserById)

router.delete('/:id', protect, deleteUserById)

export default router
