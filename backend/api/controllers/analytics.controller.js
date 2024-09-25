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

    res.json({
      daily: dailyFeedbacks,
      weekly: weeklyFeedbacks.map((w) => ({
        _id: `${w._id.isoWeekYear}-W${w._id.isoWeek}`,
        count: w.count,
      })),
      monthly: monthlyFeedbacks,
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
