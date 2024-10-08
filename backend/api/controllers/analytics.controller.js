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

    const yearlyRegistrations = await User.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y', date: '$createdAt' },
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
      yearly: yearlyRegistrations, // Add yearly data here
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch user registration stats' })
  }
}

export const getFeedbackStats = async (req, res) => {
  try {
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

    const yearlyFeedbacks = await Feedback.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])

    const formattedWeeklyFeedbacks = weeklyFeedbacks.map((w) => ({
      _id: `${w._id.isoWeekYear}-W${w._id.isoWeek}`,
      count: w.count,
    }))

    res.json({
      daily: dailyFeedbacks,
      weekly: formattedWeeklyFeedbacks,
      monthly: monthlyFeedbacks,
      yearly: yearlyFeedbacks, // Add yearly data here
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch feedback stats' })
  }
}

export const getFeedbackStatsByService = async (req, res) => {
  try {
    const { serviceName } = req.params

    if (
      ![
        'Library',
        'Office of the School Principal',
        'Office of the School Administrator',
        'Office of the Registrar',
      ].includes(serviceName)
    ) {
      return res.status(400).json({ error: 'Invalid service name' })
    }

    const dailyFeedbacks = await Feedback.aggregate([
      { $match: { serviceName } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    const weeklyFeedbacks = await Feedback.aggregate([
      { $match: { serviceName } },
      {
        $group: {
          _id: {
            isoWeekYear: { $isoWeekYear: '$createdAt' },
            isoWeek: { $isoWeek: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.isoWeekYear': 1, '_id.isoWeek': 1 } },
    ])

    const monthlyFeedbacks = await Feedback.aggregate([
      { $match: { serviceName } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    const yearlyFeedbacks = await Feedback.aggregate([
      { $match: { serviceName } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    res.json({
      daily: dailyFeedbacks,
      weekly: weeklyFeedbacks.map((w) => ({
        _id: `${w._id.isoWeekYear}-W${w._id.isoWeek}`,
        count: w.count,
      })),
      monthly: monthlyFeedbacks,
      yearly: yearlyFeedbacks, // Added yearly data
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch feedback stats by service' })
  }
}

export const getFeedbackByServices = async (req, res) => {
  const { period } = req.query

  let groupBy
  if (period === 'daily') {
    groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
  } else if (period === 'weekly') {
    groupBy = { $isoWeek: '$createdAt' }
  } else if (period === 'monthly') {
    groupBy = { $dateToString: { format: '%Y-%m', date: '$createdAt' } }
  } else if (period === 'yearly') {
    groupBy = { $dateToString: { format: '%Y', date: '$createdAt' } } // Group by year
  } else {
    return res.status(400).json({ error: 'Invalid period selected' })
  }

  try {
    const stats = await Feedback.aggregate([
      {
        $group: {
          _id: { serviceName: '$serviceName', date: groupBy },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.date': 1 } },
    ])

    res.json(stats)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

// testing

const getTimeInterval = (period) => {
  switch (period) {
    case 'daily':
      return { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
    case 'weekly':
      return { $dateToString: { format: '%Y-%U', date: '$createdAt' } }
    case 'monthly':
      return { $dateToString: { format: '%Y-%m', date: '$createdAt' } }
    case 'yearly':
      return { $dateToString: { format: '%Y', date: '$createdAt' } }
    default:
      return { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
  }
}

export const getFeedbackRatings = async (req, res) => {
  const { period = 'daily' } = req.query

  try {
    const feedbacks = await Feedback.aggregate([
      {
        $addFields: {
          // Add a new field that converts the string rating to a numeric value
          numericRating: {
            $switch: {
              branches: [
                { case: { $eq: ['$rating', 'very-dissatisfied'] }, then: 1 },
                { case: { $eq: ['$rating', 'dissatisfied'] }, then: 2 },
                { case: { $eq: ['$rating', 'neutral'] }, then: 3 },
                { case: { $eq: ['$rating', 'satisfied'] }, then: 4 },
                { case: { $eq: ['$rating', 'very-satisfied'] }, then: 5 },
              ],
              default: 3, // Default to 'neutral' if none matches
            },
          },
        },
      },
      {
        $group: {
          _id: {
            serviceName: '$serviceName',
            time: getTimeInterval(period),
          },
          averageRating: { $avg: '$numericRating' }, // Use numeric rating now
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.time': 1 },
      },
    ])

    res.json(feedbacks)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch feedback data' })
  }
}
