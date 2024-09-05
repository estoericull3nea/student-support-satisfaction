import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import mongoose from 'mongoose'
const app = express()
const PORT = process.env.PORT || 5000

mongoose.connect(process.env.CONNECTION_STRING).then(() => {
  app.listen(PORT, () =>
    console.log(`Server is Running on PORT ${PORT} and Connected to Database`)
  )
})

app.use('/api', (req, res, next) => {
  res.send('hello, world')
})
