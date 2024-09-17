import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    feedbacks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Feedback',
        required: false,
      },
    ],
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: [8, 'Password must be at least 8 characters long'],
    },

    profilePic: {
      type: String,
      default: '',
    },

    lastLoginDate: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LoginHistory',
      },
    ],

    // Email Verification
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    verificationTokenExpires: Date,
    lastVerificationRequest: Date,
    verificationRequestCount: {
      type: Number,
      default: 0,
    },
    // Email Verification
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },

    role: {
      type: String,
      enum: ['admin', 'customer'],
      default: 'customer',
    },

    active: {
      type: Boolean,
      default: true,
    },
  },

  {
    timestamps: true,
  }
)

export default mongoose.model('User', userSchema)
