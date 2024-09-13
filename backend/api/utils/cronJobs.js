import cron from 'node-cron'
import Blacklist from '../models/blacklist.model.js'

// ================================== Schedule the cron job to run every hour to clean expired tokens ==================================
cron.schedule('0 * * * *', async () => {
  try {
    await Blacklist.deleteMany({ expiresAt: { $lt: new Date() } })
    console.log('Expired tokens cleaned up')
  } catch (error) {
    console.error('Error cleaning up expired tokens:', error.message)
  }
})
