import Feedback from '../models/feedback.model.js'
import User from '../models/user.model.js'

// ================================== Create Feedback ==================================
export const createFeedback = async (req, res) => {
  const { serviceName, rating, comment, email } = req.body

  // All fields required
  if (!serviceName || !rating || !comment || !email) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  try {
    const feedback = await Feedback.create({
      serviceName,
      user: req.user.id,
      rating,
      comment,
      email,
    })

    if (req.user.id) {
      await User.findByIdAndUpdate(req.user.id, {
        $push: { feedbacks: feedback._id },
      })
    }

    // Success response
    res
      .status(201)
      .json({ message: 'Feedback submitted successfully', feedback })
  } catch (error) {
    res.status(500).json({ message: 'Error submitting feedback', error })
  }
}

// ================================== Get Feedbacks by Service ==================================
export const getFeedbackByService = async (req, res) => {
  const { serviceId } = req.params
  try {
    const feedbacks = await Feedback.find({ _id: serviceId })
    res.status(200).json(feedbacks)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedback', error })
  }
}

// ================================== Get All Feedbacks ==================================
export const getAllFeedbacks = async (_, res) => {
  try {
    const feedbacks = await Feedback.find().populate('user')

    if (!feedbacks.length) {
      return res.status(404).json({ message: 'No Feedbacks Found' })
    }

    res.status(200).json(feedbacks)
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message })
  }
}

// ================================== Get All Feedbacks By User ID ==================================
export const getAllFeedbacksByUserId = async (req, res) => {
  const { userId } = req.params // Extract userId from route parameters

  try {
    const feedbacks = await Feedback.find({ user: userId }).sort({
      createdAt: -1,
    })

    if (!feedbacks.length) {
      return res
        .status(404)
        .json({ message: 'No feedbacks found for this user' })
    }

    // Success response
    res.status(200).json(feedbacks)
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message })
  }
}

// ================================== Clear All Feedbacks ==================================
export const clearAllFeedbacks = async (_, res) => {
  try {
    const deletedFeedbacks = await Feedback.deleteMany({})

    // Success response
    res.status(200).json({
      message: `${deletedFeedbacks.deletedCount} feedback(s) cleared successfully`,
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message })
  }
}
