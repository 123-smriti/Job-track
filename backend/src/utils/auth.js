import jwt from 'jsonwebtoken'

export const authCookieName = 'jobtrack_token'

function getJwtSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret || secret === 'replace-this-with-a-long-random-secret' || secret.length < 32) {
    throw new Error('JWT_SECRET must be a random value of at least 32 characters')
  }

  return secret
}

export function validateJwtSecret() {
  getJwtSecret()
}

export function createAuthToken(user) {
  return jwt.sign(
    { role: user.role },
    getJwtSecret(),
    {
      subject: user._id.toString(),
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
  )
}

export function setAuthCookie(response, token) {
  response.cookie(authCookieName, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  })
}

export function clearAuthCookie(response) {
  response.clearCookie(authCookieName, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  })
}

export function serializeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    profile: user.profile,
    resume: user.resume,
    createdAt: user.createdAt,
  }
}
