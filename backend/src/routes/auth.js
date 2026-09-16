import bcrypt from 'bcrypt'
import { Router } from 'express'
import User from '../models/User.js'
import { requireAuth } from '../middleware/auth.js'
import { clearAuthCookie, createAuthToken, serializeUser, setAuthCookie } from '../utils/auth.js'

const router = Router()
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const publicRoles = ['candidate', 'recruiter']

function normalizeEmail(email) {
  return typeof email === 'string' ? email.trim().toLowerCase() : ''
}

function validateRegistration(body) {
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const email = normalizeEmail(body.email)
  const password = typeof body.password === 'string' ? body.password : ''
  const role = typeof body.role === 'string' ? body.role.trim().toLowerCase() : 'candidate'

  if (name.length < 2 || name.length > 120) return 'Name must be between 2 and 120 characters'
  if (!emailPattern.test(email)) return 'A valid email address is required'
  if (password.length < 8 || password.length > 72) return 'Password must be between 8 and 72 characters'
  if (!publicRoles.includes(role)) return 'Role must be candidate or recruiter'

  return null
}

router.post('/register', async (request, response, next) => {
  try {
    const validationError = validateRegistration(request.body)
    if (validationError) {
      return response.status(400).json({ success: false, message: validationError })
    }

    const name = request.body.name.trim()
    const email = normalizeEmail(request.body.email)
    const password = request.body.password
    const role = request.body.role?.trim().toLowerCase() || 'candidate'
    const existingUser = await User.findOne({ email }).select('_id')

    if (existingUser) {
      return response.status(409).json({ success: false, message: 'An account with that email already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await User.create({ name, email, password: hashedPassword, role })
    const token = createAuthToken(user)

    setAuthCookie(response, token)
    return response.status(201).json({ success: true, user: serializeUser(user) })
  } catch (error) {
    if (error.code === 11000) {
      return response.status(409).json({ success: false, message: 'An account with that email already exists' })
    }

    return next(error)
  }
})

router.post('/login', async (request, response, next) => {
  try {
    const email = normalizeEmail(request.body.email)
    const password = typeof request.body.password === 'string' ? request.body.password : ''

    if (!emailPattern.test(email) || !password) {
      return response.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    const user = await User.findOne({ email }).select('+password')
    const passwordMatches = user ? await bcrypt.compare(password, user.password) : false

    if (!user || !passwordMatches || !user.isActive) {
      return response.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    const token = createAuthToken(user)
    setAuthCookie(response, token)
    return response.status(200).json({ success: true, user: serializeUser(user) })
  } catch (error) {
    return next(error)
  }
})

router.get('/me', requireAuth, (request, response) => {
  response.status(200).json({ success: true, user: serializeUser(request.user) })
})

router.post('/logout', (request, response) => {
  clearAuthCookie(response)
  response.status(204).send()
})

export default router
