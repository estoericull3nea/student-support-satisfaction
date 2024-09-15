// ================================== Imports ==================================
import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

// Routes
import userRouter from './api/routes/user.route.js'
import authRouter from './api/routes/auth.route.js'
import loginHistoryRouter from './api/routes/loginHistory.route.js'
import feedbackRouter from './api/routes/feedback.route.js'
import contactRouter from './api/routes/contact.route.js'
import connectDB from './api/utils/connectDB.js'

// Cleaning of expired token every hour
import './api/utils/cronJobs.js'

dotenv.config()

const PORT = process.env.PORT || 5000
const app = express()
app.use(cors({ origin: 'http://localhost:5173' }))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve static files (for serving the uploaded profile pictures)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Using Routes
app.use('/api/users', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/feedbacks', feedbackRouter)
app.use('/api/contacts', contactRouter)
app.use('/api/logins/history', loginHistoryRouter)

// ================================== Connection to MongoDB ==================================
connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server is Running on PORT ${PORT} and Connected to Database`)
    )
  })
  .catch((err) => console.log(err))
