import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import User from '../models/User.js'
import { authCookieName } from '../utils/auth.js'

function getToken(request) {
  const cookieToken = request.cookies?.[authCookieName]
  if (cookieToken) return cookieToken

  const authorization = request.get('authorization')
  if (authorization?.startsWith('Bearer ')) {
    return authorization.slice(7)
  }

  return null
}

export async function requireAuth(request, response, next) {
  const token = getToken(request)

  if (!token) {
    return response.status(401).json({ success: false, message: 'Authentication required' })
  }

  try {
    const secret = process.env.JWT_SECRET
    if (!secret || secret === 'replace-this-with-a-long-random-secret' || secret.length < 32) {
      throw new Error('JWT_SECRET must be a random value of at least 32 characters')
    }

    const payload = jwt.verify(token, secret)
    if (!mongoose.isValidObjectId(payload.sub)) {
      return response.status(401).json({ success: false, message: 'Invalid authentication token' })
    }

    const user = await User.findById(payload.sub).select('-password')

    if (!user) {
      return response.status(401).json({ success: false, message: 'User account no longer exists' })
    }

    if (!user.isActive) {
      return response.status(401).json({ success: false, message: 'User account is inactive' })
    }

    request.user = user
    return next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return response.status(401).json({ success: false, message: 'Authentication token expired' })
    }

    if (error.name === 'JsonWebTokenError') {
      return response.status(401).json({ success: false, message: 'Invalid authentication token' })
    }

    return next(error)
  }
}

export function requireRole(...allowedRoles) {
  return (request, response, next) => {
    if (!request.user) {
      return response.status(401).json({ success: false, message: 'Authentication required' })
    }

    if (!allowedRoles.includes(request.user.role)) {
      return response.status(403).json({ success: false, message: 'You do not have permission to access this resource' })
    }

    return next()
  }
}
