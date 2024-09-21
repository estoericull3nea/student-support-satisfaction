import Admin from '../models/admin.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const registerAdmin = async (req, res) => {
  try {
    const { username, password } = req.body

    const existingAdmin = await Admin.findOne({ username })
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newAdmin = new Admin({
      username,
      password: hashedPassword,
    })

    await newAdmin.save()
    return res.status(201).json({ message: 'Admin registered successfully' })
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error })
  }
}

const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body

    const admin = await Admin.findOne({ username })
    if (!admin) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password)
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    })

    return res.status(200).json({ token, message: 'Login successful' })
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error })
  }
}

const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find()
    return res.status(200).json(admins)
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error })
  }
}

const getAdmin = async (req, res) => {
  try {
    const { id } = req.params
    const admin = await Admin.findById(id)
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' })
    }
    return res.status(200).json(admin)
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error })
  }
}

const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params
    const updatedData = req.body

    if (updatedData.password) {
      updatedData.password = await bcrypt.hash(updatedData.password, 10)
    }

    if (updatedData.username) {
      updatedData.username = updateAdmin.username
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(id, updatedData, {
      new: true,
    })

    if (!updatedAdmin) {
      return res.status(404).json({ message: 'Admin not found' })
    }

    return res.status(200).json(updatedAdmin)
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error })
  }
}

const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params
    const deletedAdmin = await Admin.findByIdAndDelete(id)

    if (!deletedAdmin) {
      return res.status(404).json({ message: 'Admin not found' })
    }

    return res.status(200).json({ message: 'Admin deleted successfully' })
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error })
  }
}

module.exports = {
  registerAdmin,
  loginAdmin,
  getAllAdmins,
  getAdmin,
  updateAdmin,
  deleteAdmin,
}
