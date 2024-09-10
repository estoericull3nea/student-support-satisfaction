import loginHistoryModel from '../models/loginHistory.model.js'
import mongoose from 'mongoose'
import { formatLoginTime } from '../utils/formatTime.js'

// Get all login history entries
export const getAllLogins = async (req, res) => {
  try {
    // Fetch login history and populate the 'userId' field with user data
    const loginHistory = await loginHistoryModel
      .find()
      .populate('userId') // Populate with 'name' and 'email' from User model
      .sort({ loginTime: -1 })

    // Check if no logins were found
    if (!loginHistory.length) {
      return res.status(404).json({ message: 'No Logins Found' })
    }

    // Format the loginTime before sending the response
    const formattedHistory = loginHistory.map((history) => ({
      ...history.toObject(),
      loginTime: formatLoginTime(history.loginTime),
    }))

    res.status(200).json(formattedHistory)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Get a specific login history entry by ID
export const getLoginHistoryById = async (req, res) => {
  const { id } = req.params

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format' })
  }

  try {
    // Fetch login history by ID and populate the 'userId' field with user data
    const loginHistory = await loginHistoryModel.findById(id).populate('userId') // Populate with 'name' and 'email' from User model

    if (!loginHistory) {
      return res.status(404).json({ message: 'Login history not found' })
    }

    // Format the loginTime before sending the response
    const formattedHistory = {
      ...loginHistory.toObject(),
      loginTime: formatLoginTime(loginHistory.loginTime),
    }

    res.status(200).json(formattedHistory)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Delete a specific login history entry by ID
export const deleteLoginHistoryById = async (req, res) => {
  const { id } = req.params

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format' })
  }

  try {
    const deletedHistory = await loginHistoryModel.findByIdAndDelete(id)

    if (!deletedHistory) {
      return res.status(404).json({ message: 'Login history not found' })
    }

    res.status(200).json({ message: 'Login history deleted successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Clear all login history (use cautiously, should be restricted to admins)
export const clearLoginHistory = async (req, res) => {
  try {
    await loginHistoryModel.deleteMany({})
    res.status(200).json({ message: 'All login history cleared' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}
