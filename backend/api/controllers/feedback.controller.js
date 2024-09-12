import Feedback from '../models/feedback.model.js'

// Create Feedback
export const createFeedback = async (req, res) => {
  const { serviceName, rating, comment, email } = req.body
  try {
    const feedback = await Feedback.create({
      serviceName,
      user: req.user._id, // Ensure user is authenticated
      rating,
      comment,
      email,
    })
    res
      .status(201)
      .json({ message: 'Feedback submitted successfully', feedback })
  } catch (error) {
    res.status(500).json({ message: 'Error submitting feedback', error })
  }
}

// Get Feedbacks by Service
export const getFeedbackByService = async (req, res) => {
  const { serviceId } = req.params
  try {
    const feedbacks = await Feedback.find({ service: serviceId }).populate(
      'user',
      'email'
    )
    res.status(200).json(feedbacks)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedback', error })
  }
}
