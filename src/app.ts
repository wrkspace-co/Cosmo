import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

import downloadRoutes from './routes/download.route'
import updateRoutes from './routes/update.route'
import apiRoutes from './routes/api.route'
import { authMiddleware } from './middlewares/auth.middleware'

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.use('/download', downloadRoutes)
app.use('/update', updateRoutes)
app.use('/api', authMiddleware, apiRoutes)

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
