import mongoose from 'mongoose'

const feedbackSchema = new mongoose.Schema(
  {
    serviceName: {
      type: String,
      required: true,
      enum: [
        'Library',
        'Office of the School Principal',
        'Office of the School Administrator',
        'Office of the Registrar',
      ],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: String,
      enum: [
        'very-dissatisfied',
        'dissatisfied',
        'neutral',
        'satisfied',
        'very-satisfied',
      ],
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

export default mongoose.model('Feedback', feedbackSchema)
