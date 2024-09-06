import mongoose from 'mongoose'

const blacklistSchema = new mongoose.Schema({
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true }, // Set token expiration date to handle cleanup
})

export default mongoose.model('Blacklist', blacklistSchema)
