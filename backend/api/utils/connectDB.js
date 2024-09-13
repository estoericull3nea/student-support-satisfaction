import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

// ================================== Connecting MongoDB ==================================
const connectDB = async () => {
  mongoose.connect(process.env.CONNECTION_STRING)
}
export default connectDB
