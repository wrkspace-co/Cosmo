import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

import downloadRoutes from './routes/download.route'
import updateRoutes from './routes/update.route'
import apiRoutes from './routes/api.route'
import { authMiddleware } from './middlewares/auth.middleware'

// Define the whitelist of allowed origins
const allowedOrigins = ['https://wrkspace.co', 'https://staging.wrkspace.co']

// CORS options
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps or curl)
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
}

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors(corsOptions))
app.options('*', cors(corsOptions))
app.use(express.json())

app.use('/download', downloadRoutes)
app.use('/update', updateRoutes)
app.use('/api', authMiddleware, apiRoutes)

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
