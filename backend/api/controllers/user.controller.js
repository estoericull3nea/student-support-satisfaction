import dotenv from 'dotenv'
import User from '../models/user.model.js'
import mongoose from 'mongoose'
dotenv.config()

// Get All Users
export const getAllUsers = async (req, res) => {
  try {
    // Finding all users, excluding sensitive fields like password
    const users = await User.find().select('-password').lean()

    // Check if no users were found
    if (!users.length) {
      return res.status(404).json({ message: 'No Users Found' })
    }

    // Return user data along with count
    return res.status(200).json({
      count: users.length,
      users,
    })
  } catch (error) {
    // Return server error status in case of failure
    return res.status(500).json({ message: 'Server Error: ' + error.message })
  }
}

// Get User By ID
export const getUserById = async (req, res) => {
  const { id } = req.params // Extract the user ID from the request parameters

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

    // Return the user data
    return res.status(200).json(user)
  } catch (error) {
    // Return a 500 server error if something goes wrong
    return res.status(500).json({ message: 'Server error: ' + error.message })
  }
}

// Update User
export const updateUserById = async (req, res) => {
  const { id } = req.params // Assuming user ID is passed as a route parameter
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

    // ======================= Dynamic Field Updates =======================
    // Update the first name if provided
    if (firstName) {
      user.firstName = firstName
    }

    // Update the last name if provided
    if (lastName) {
      user.lastName = lastName
    }

    // Save the updated user
    const updatedUser = await user.save()

    // Return the updated user data, excluding sensitive information
    return res.status(200).json({
      message: 'User updated successfully',
      updatedUser,
    })
  } catch (error) {
    // Error handling
    return res.status(500).json({ message: 'Server error: ' + error.message })
  }
}

// Delete User
export const deleteUserById = async (req, res) => {
  const { id } = req.params // Assuming user ID is passed as a route parameter

  // Checking if the id is valid for mongodb or not
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Invalid ID' })
  }

  try {
    // Find and delete the user by ID
    const user = await User.findByIdAndDelete(id)

    // If the user does not exist
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Success response
    return res.status(200).json({ message: 'User deleted successfully' })
  } catch (error) {
    // Error handling
    return res.status(500).json({ message: 'Server error: ' + error.message })
  }
}

// Delete All Users
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
    // Handle any errors that occur
    return res.status(500).json({ message: 'Server error: ' + error.message })
  }
}
