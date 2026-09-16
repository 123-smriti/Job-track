import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import { getDatabaseStatus } from './config/db.js'
import authRoutes from './routes/auth.js'
import jobRoutes from './routes/jobs.js'
import userRoutes from './routes/users.js'
import recruiterRoutes from './routes/recruiter.js'
import adminRoutes from './routes/admin.js'

dotenv.config()

const app = express()
const clientUrls = (process.env.CLIENT_URL || 'http://localhost:5173,http://127.0.0.1:5173').split(',').map((url) => url.trim())
const allowedOrigins = new Set(clientUrls)

app.disable('x-powered-by')
app.use(helmet())
app.use(cors({ origin: (origin, callback) => callback(null, !origin || allowedOrigins.has(origin)), credentials: true }))
app.use(express.json({ limit: '100kb' }))
app.use(cookieParser())

app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 60, standardHeaders: 'draft-8', legacyHeaders: false }))

app.use('/api/auth', authRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/users', userRoutes)
app.use('/api/recruiter', recruiterRoutes)
app.use('/api/admin', adminRoutes)

app.get('/api/health', (request, response) => {
  response.status(200).json({
    success: true,
    message: 'JobTrack API is running',
    database: getDatabaseStatus(),
    timestamp: new Date().toISOString(),
  })
})

app.use((request, response) => {
  response.status(404).json({
    success: false,
    message: 'Route not found',
  })
})

app.use((error, request, response, next) => {
  console.error(error)
  if (error.code === 'LIMIT_FILE_SIZE' || error.message === 'Resume must be a PDF or Word document') {
    return response.status(400).json({ success: false, message: error.message })
  }

  if (error.type === 'entity.too.large') {
    return response.status(413).json({ success: false, message: 'Request body is too large' })
  }

  response.status(500).json({
    success: false,
    message: 'Internal server error',
  })
})

export default app
