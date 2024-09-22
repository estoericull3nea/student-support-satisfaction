import User from '../models/user.model.js'
import Feedback from '../models/feedback.model.js'

export const getUserRegistrationStats = async (req, res) => {
  try {
    const dailyRegistrations = await User.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])

    const weeklyRegistrations = await User.aggregate([
      {
        $group: {
          _id: {
            isoWeekYear: { $isoWeekYear: '$createdAt' },
            isoWeek: { $isoWeek: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.isoWeekYear': 1, '_id.isoWeek': 1 },
      },
    ])

    const monthlyRegistrations = await User.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])

    res.json({
      daily: dailyRegistrations,
      weekly: weeklyRegistrations.map((w) => ({
        _id: `${w._id.isoWeekYear}-W${w._id.isoWeek}`,
        count: w.count,
      })),
      monthly: monthlyRegistrations,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch user registration stats' })
  }
}

// Get average feedbacks per day, week, and month
export const getFeedbackStats = async (req, res) => {
  try {
    // Group feedbacks by day
    const dailyFeedbacks = await Feedback.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])

    // Group feedbacks by week using $isoWeek and $isoWeekYear
    const weeklyFeedbacks = await Feedback.aggregate([
      {
        $group: {
          _id: {
            isoWeekYear: { $isoWeekYear: '$createdAt' },
            isoWeek: { $isoWeek: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.isoWeekYear': 1, '_id.isoWeek': 1 },
      },
    ])

    // Group feedbacks by month
    const monthlyFeedbacks = await Feedback.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])

    // Format weekly results for easier display
    const formattedWeeklyFeedbacks = weeklyFeedbacks.map((w) => ({
      _id: `${w._id.isoWeekYear}-W${w._id.isoWeek}`,
      count: w.count,
    }))

    res.json({
      daily: dailyFeedbacks,
      weekly: formattedWeeklyFeedbacks,
      monthly: monthlyFeedbacks,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch feedback stats' })
  }
}
