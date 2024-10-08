import mongoose from 'mongoose'

const contactSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: false,
      default: null,
    },
  },
  { timestamps: true }
)

export default mongoose.model('Contact', contactSchema)
