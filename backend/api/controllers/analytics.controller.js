import User from '../models/user.model.js'

// Get average registered users per day, week, month
export const getUserRegistrationStats = async (req, res) => {
  try {
    // Group users by day
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

    // Group users by week using $isoWeek and $isoWeekYear
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

    // Group users by month
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
        _id: `${w._id.isoWeekYear}-W${w._id.isoWeek}`, // Format for week display
        count: w.count,
      })),
      monthly: monthlyRegistrations,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch user registration stats' })
  }
}
