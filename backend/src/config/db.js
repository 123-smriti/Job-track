import mongoose from 'mongoose'

export async function connectToDatabase() {
  const mongoUri = process.env.MONGODB_URI

  if (!mongoUri) {
    throw new Error('MONGODB_URI is not configured')
  }

  mongoose.connection.on('error', (error) => {
    console.error('[MongoDB] Connection error:', error.message)
  })

  mongoose.connection.on('disconnected', () => {
    console.warn('[MongoDB] Disconnected')
  })

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000,
  })

  console.log(`[MongoDB] Connected to database: ${mongoose.connection.name}`)
}

export function getDatabaseStatus() {
  return mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
}
