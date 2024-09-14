import User from '../models/user.model.js'

import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { formatTime } from '../utils/formatTime.js'
import { formatToMMDDYYYY } from '../utils/formatToMonthDayYear.js'

dotenv.config()

// ================================== Get All Users ==================================
export const getAllUsers = async (_, res) => {
  try {
    // Finding all users, excluding sensitive fields like password
    const users = await User.find().select('-password')

    // Check if no users were found
    if (!users.length) {
      return res.status(404).json({ message: 'No Users Found' })
    }

    const format = users.map((user) => ({
      ...user.toObject(),
      createAt: formatTime(user.createdAt),
    }))

    // Return user data along with count
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

  // Checking if the id is valid for mongodb or not
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Invalid ID' })
  }

  try {
    // Find the user by ID, excluding the password field
    const user = await User.findById(id).select('-password')

    // If user is not found, return a 404 error
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const formatUser = {
      ...user.toObject(),
      createdAt: formatToMMDDYYYY(formatTime(user.createdAt)),
    }

    return res.status(200).json(formatUser)
  } catch (error) {
    return res.status(500).json({ message: 'Server error: ' + error.message })
  }
}

// ================================== Update User ==================================
export const updateUserById = async (req, res) => {
  const { id } = req.params
  const { firstName, lastName } = req.body

  // Checking if the id is valid for mongodb or not
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Invalid ID' })
  }

  try {
    // Find the user by ID
    const user = await User.findById(id)

    // If the user does not exist
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Dynamic Field Updates
    // Update the first name if provided
    if (firstName) {
      user.firstName = firstName
    }

    // Update the last name if provided
    if (lastName) {
      user.lastName = lastName
    }

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

  // Checking if the id is valid for mongodb or not
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Invalid ID' })
  }

  try {
    const user = await User.findByIdAndDelete(id)

    // If the user does not exist
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Success response
    return res.status(200).json({ message: 'User deleted successfully' })
  } catch (error) {
    return res.status(500).json({ message: 'Server error: ' + error.message })
  }
}

// ================================== Delete All Users ==================================
export const deleteAllUsers = async (_, res) => {
  try {
    // Check if there are any registered users
    const userCount = await User.countDocuments()

    // If no users are found, return a message
    if (userCount === 0) {
      return res.status(400).json({
        message: 'No users found, nothing to delete',
      })
    }

    // Perform deletion of all users
    const result = await User.deleteMany({})

    return res.status(200).json({
      message: 'All users have been deleted',
      deletedCount: result.deletedCount,
    })
  } catch (error) {
    return res.status(500).json({ message: 'Server error: ' + error.message })
  }
}
