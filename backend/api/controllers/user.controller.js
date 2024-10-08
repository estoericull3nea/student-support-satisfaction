import User from '../models/user.model.js'

import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import { formatTime } from '../utils/formatTime.js'
import { formatToMMDDYYYY } from '../utils/formatToMonthDayYear.js'

dotenv.config()

// ================================== Get All Users ==================================
export const getAllUsers = async (_, res) => {
  try {
    const users = await User.find().select('-password')

    if (!users.length) {
      return res.status(404).json({ message: 'No Users Found' })
    }

    const format = users.map((user) => ({
      ...user.toObject(),
      createAt: formatTime(user.createdAt),
    }))

    return res.status(200).json({
      count: users.length,
      format,
    })
  } catch (error) {
    return res.status(500).json({ message: 'Server Error: ' + error.message })
  }
}

// ================================== Get User By ID ==================================
export const getUserById = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Invalid ID' })
  }

  try {
    const user = await User.findById(id)
      .select('-password')
      .populate('feedbacks')
      .populate({
        path: 'lastLoginDate',
        options: { sort: { loginTime: -1 } },
      })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const formattedLastLoginDate = user.lastLoginDate.map((login) => ({
      ...login.toObject(),
      loginTime: formatTime(login.loginTime),
    }))

    const formattedUser = {
      ...user.toObject(),
      createdAt: formatToMMDDYYYY(formatTime(user.createdAt)),
      lastLoginDate: formattedLastLoginDate,
    }

    return res.status(200).json(formattedUser)
  } catch (error) {
    return res.status(500).json({ message: 'Server error: ' + error.message })
  }
}

// ================================== Update User ==================================
export const updateUserById = async (req, res) => {
  const { id } = req.params
  const { firstName, lastName, password, active, isVerified } = req.body

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Invalid ID' })
  }

  try {
    const user = await User.findById(id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (firstName) user.firstName = firstName
    if (lastName) user.lastName = lastName
    if (password) user.password = await bcrypt.hash(password, 10)
    if (active !== undefined) user.active = active
    if (isVerified !== undefined) user.isVerified = isVerified

    const updatedUser = await user.save()

    return res.status(200).json({
      message: 'User updated successfully',
      updatedUser,
    })
  } catch (error) {
    return res.status(500).json({ message: 'Server error: ' + error.message })
  }
}

// ================================== Delete User ==================================
export const deleteUserById = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Invalid ID' })
  }

  try {
    const user = await User.findByIdAndDelete(id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.status(200).json({ message: 'User deleted successfully' })
  } catch (error) {
    return res.status(500).json({ message: 'Server error: ' + error.message })
  }
}

export const makeUserInactive = async (req, res) => {
  try {
    const { id } = req.params

    const user = await User.findByIdAndUpdate(id, { active: false })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.status(200).json({
      success: true,
      message: 'User has been made inactive',
      data: user,
    })
  } catch (error) {
    console.error('Error making user inactive:', error)
    return res.status(500).json({
      success: false,
      message: 'An error occurred while making the user inactive',
    })
  }
}

export const toggleActive = async (req, res) => {
  try {
    const { id } = req.params
    const { active } = req.body

    const user = await User.findByIdAndUpdate(id, { active })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json({ message: 'User status updated', user })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

// ================================== Delete All Users ==================================
export const deleteAllUsers = async (_, res) => {
  try {
    const userCount = await User.countDocuments()

    if (userCount === 0) {
      return res.status(400).json({
        message: 'No users found, nothing to delete',
      })
    }

    const result = await User.deleteMany({})

    return res.status(200).json({
      message: 'All users have been deleted',
      deletedCount: result.deletedCount,
    })
  } catch (error) {
    return res.status(500).json({ message: 'Server error: ' + error.message })
  }
}

export const searchAnythingOnUser = async (req, res) => {
  const { query = '', sortField, sortOrder, page = 1, limit = 10 } = req.query

  try {
    let booleanFilters = {}
    if (query.toLowerCase() === 'isverified') {
      booleanFilters.isVerified = true
    } else if (query.toLowerCase() === 'active') {
      booleanFilters.active = true
    } else if (query.toLowerCase() === 'notverified') {
      booleanFilters.isVerified = false
    } else if (query.toLowerCase() === 'inactive') {
      booleanFilters.active = false
    }

    const textSearchCondition = query
      ? {
          $or: [
            { firstName: { $regex: query, $options: 'i' } },
            { lastName: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } },
            { role: { $regex: query, $options: 'i' } },
          ],
        }
      : {}

    const filters = {
      ...textSearchCondition,
      ...booleanFilters,
    }

    const sortOptions = {}
    if (sortField) {
      sortOptions[sortField] = sortOrder === 'desc' ? -1 : 1
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const userLimit = parseInt(limit)

    const users = await User.find(filters)
      .sort(sortOptions)
      .skip(skip)
      .limit(userLimit)

    const totalUsers = await User.countDocuments(filters)

    res.status(200).json({
      users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: parseInt(page),
    })
  } catch (error) {
    res.status(500).json({ error: 'Error searching users' })
  }
}

export const getAllInactiveUser = async (req, res) => {
  try {
    const inactiveUsers = await User.find({ active: false })

    if (inactiveUsers.length === 0) {
      return res.status(404).json({ message: 'No inactive users found' })
    }

    res.status(200).json(inactiveUsers)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inactive users', error })
  }
}

export const makeUserActive = async (req, res) => {
  try {
    const { id } = req.params

    const user = await User.findByIdAndUpdate(
      id,
      { active: true },
      { new: true }
    )

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.status(200).json({
      success: true,
      message: 'User has been made active',
      data: user,
    })
  } catch (error) {
    console.error('Error making user active:', error)
    return res.status(500).json({
      success: false,
      message: 'An error occurred while making the user active',
    })
  }
}

export const getAllActiveUser = async (req, res) => {
  try {
    const activeUsers = await User.find({ active: true })

    if (activeUsers.length === 0) {
      return res.status(404).json({ message: 'No active users found' })
    }

    res.status(200).json(activeUsers)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inactive users', error })
  }
}

export const addUserFromAdmin = async (req, res) => {
  const { firstName, lastName, email, password, active, isVerified } = req.body

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      active: active || false,
      isVerified: isVerified || false,
    })

    await newUser.save()

    return res.status(201).json({
      message: 'User added successfully',
      newUser,
    })
  } catch (error) {
    return res.status(500).json({ message: 'Server error: ' + error.message })
  }
}

export const getAllFeedbacksByUserEmail = async (req, res) => {
  const { email } = req.query
  try {
    const users = await Feedback.find({ email }).select('-password')

    if (!users.length) {
      return res
        .status(404)
        .json({ message: 'No Feedbacks of this User Found' })
    }

    const format = users.map((user) => ({
      ...user.toObject(),
      createAt: formatTime(user.createdAt),
    }))

    return res.status(200).json({
      count: users.length,
      format,
    })
  } catch (error) {
    return res.status(500).json({ message: 'Server Error: ' + error.message })
  }
}
