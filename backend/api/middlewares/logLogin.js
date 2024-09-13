import LoginHistory from '../models/loginHistory.model.js'

// ================================== Logger the Login ==================================
export const logLogin = async (req, userId) => {
  try {
    const loginHistory = new LoginHistory({
      userId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    })

    await loginHistory.save()
    console.log('Login history logged successfully')
  } catch (error) {
    console.error('Error logging login history:', error)
  }
}
