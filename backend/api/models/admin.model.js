import mongoose from 'mongoose'

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: [8, 'Password must be at least 8 characters long'],
    },
    role: {
      type: String,
      default: 'admin',
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Admin', adminSchema)
