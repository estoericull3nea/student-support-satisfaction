import LoginHistory from '../models/loginHistory.model.js'
import User from '../models/user.model.js'

// ================================== Logger the Login ==================================
export const logLogin = async (req, userId) => {
  try {
    const loginHistory = new LoginHistory({
      userId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    })

    await loginHistory.save()

    await User.findByIdAndUpdate(userId, {
      $push: { lastLoginDate: loginHistory._id },
    })

    console.log('Login history logged successfully')
  } catch (error) {
    console.error('Error logging login history:', error)
  }
}
