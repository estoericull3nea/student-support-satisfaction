import mongoose from 'mongoose'

const visitSchema = new mongoose.Schema(
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
    visitCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

export default mongoose.model('Visit', visitSchema)
