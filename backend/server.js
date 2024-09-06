// ======================= Imports =======================
import dotenv from 'dotenv'
import express from 'express'

// Routes
import userRouter from './api/routes/userRoutes.js'
import connectDB from './api/utils/connectDB.js'

dotenv.config()
const PORT = process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Using Routes
app.use('/api/users', userRouter)

// ======================= Connection to MongoDB =======================
connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server is Running on PORT ${PORT} and Connected to Database`)
    )
  })
  .catch((err) => console.log(err))
