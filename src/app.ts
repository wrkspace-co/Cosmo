import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

import downloadRoutes from './routes/download.route'
import updateRoutes from './routes/update.route'
import apiRoutes from './routes/api.route'
import { authMiddleware } from './middlewares/auth.middleware'

// CORS options
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // allow tools like curl / mobile apps
    if (!origin) {
      return callback(null, true)
    }

    try {
      const hostname = new URL(origin).hostname
      // allow any *.wrkspace.co
      if (
        hostname.endsWith('.wrkspace.co') ||
        hostname === 'wrkspace.co' ||
        hostname === 'localhost' ||
        hostname === '127.0.0.1'
      ) {
        return callback(null, true)
      }
    } catch {
      // malformed origin—block it
    }

    callback(new Error('Not allowed by CORS'))
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
}

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors(corsOptions))
app.options('/{*splat}', cors(corsOptions))

app.use(express.json())
app.use((req, res, next) => {
  res.setHeader('Accept-Ranges', 'bytes')
  next()
})

app.use('/download', downloadRoutes)
app.use('/update', updateRoutes)
app.use('/api', authMiddleware, apiRoutes)
app.all('/{*splat}', (req, res) => res.status(404).send('Not Found'))

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
