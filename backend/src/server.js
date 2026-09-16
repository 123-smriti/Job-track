import dotenv from 'dotenv'
import { connectToDatabase } from './config/db.js'
import app from './app.js'
import { validateJwtSecret } from './utils/auth.js'

dotenv.config()

const port = process.env.PORT || 5000

async function startServer() {
  try {
    validateJwtSecret()
    await connectToDatabase()

    app.listen(port, () => {
      console.log(`JobTrack API listening on port ${port}`)
    })
  } catch (error) {
    console.error(`[Startup] Unable to start JobTrack API: ${error.message}`)
    process.exitCode = 1
  }
}

startServer()
