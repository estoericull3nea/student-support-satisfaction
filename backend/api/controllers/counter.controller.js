import User from '../models/user.model.js'
import Feedback from '../models/feedback.model.js'

export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()

    const activeUsers = await User.countDocuments({ active: true })

    const inactiveUsers = await User.countDocuments({ active: false })

    const feedbackCount = await Feedback.countDocuments()

    const recentRegisteredUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(1)

    const recentSigninUsers = await User.find()
      .sort({ lastLoginDate: -1 })
      .limit(1)

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        totalFeedbacks: feedbackCount,
        recentRegisteredUsers,
        recentSigninUsers,
      },
    })
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the stats',
      error: error.message,
    })
  }
}

export const getTopFeedbackServices = async (req, res) => {
  try {
    const topServices = await Feedback.aggregate([
      {
        $group: {
          _id: '$serviceName',
          totalCount: { $sum: 1 },
        },
      },
      {
        $sort: { totalCount: -1 },
      },
      {
        $limit: 10,
      },
    ])

    return res.status(200).json({
      success: true,
      data: topServices,
    })
  } catch (error) {
    console.error('Error fetching top feedback services:', error)
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching top feedback services',
      error: error.message,
    })
  }
}

export const getTopTenRecentUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 }).limit(10).exec()

    return res.status(200).json({
      success: true,
      data: users,
    })
  } catch (error) {
    console.error('Error fetching Users:', error)
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching Users',
      error: error.message,
    })
  }
}
