// ======================= Imports =======================
import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'

// Routes
import userRouter from './api/routes/user.route.js'
import authRouter from './api/routes/auth.route.js'
import connectDB from './api/utils/connectDB.js'

// Cleaning of expired token every hour
import './api/utils/cronJobs.js'

dotenv.config()

const PORT = process.env.PORT || 5000
const app = express()
app.use(cors({ origin: 'http://localhost:5173' }))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Using Routes
app.use('/api/users', userRouter)
app.use('/api/auth', authRouter)

// ======================= Connection to MongoDB =======================
connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server is Running on PORT ${PORT} and Connected to Database`)
    )
  })
  .catch((err) => console.log(err))
