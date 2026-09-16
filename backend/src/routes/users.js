import { unlink } from 'node:fs/promises'
import mongoose from 'mongoose'
import { Router } from 'express'
import Application from '../models/Application.js'
import Job from '../models/Job.js'
import SavedJob from '../models/SavedJob.js'
import User from '../models/User.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { resumeUpload } from '../middleware/upload.js'

const router = Router()

function isValidId(id) {
  return mongoose.isValidObjectId(id)
}

router.use(requireAuth, requireRole('candidate'))

router.get('/resume', async (request, response, next) => {
  if (!request.user.resume?.url) return response.status(404).json({ success: false, message: 'Resume not found' })

  try {
    return response.download(`.${request.user.resume.url}`, request.user.resume.filename)
  } catch (error) {
    return next(error)
  }
})

router.get('/profile', (request, response) => {
  response.status(200).json({ success: true, data: request.user })
})

router.put('/profile', async (request, response, next) => {
  try {
    const allowedFields = ['name', 'profile']
    const updates = Object.fromEntries(Object.entries(request.body).filter(([key]) => allowedFields.includes(key)))
    if (updates.name !== undefined && (typeof updates.name !== 'string' || updates.name.trim().length < 2)) {
      return response.status(400).json({ success: false, message: 'Name must be at least 2 characters' })
    }

    const user = await User.findByIdAndUpdate(request.user._id, updates, { new: true, runValidators: true }).select('-password')
    return response.status(200).json({ success: true, data: user })
  } catch (error) {
    return next(error)
  }
})

router.post('/resume', resumeUpload.single('resume'), async (request, response, next) => {
  if (!request.file) return response.status(400).json({ success: false, message: 'A resume file is required' })

  try {
    const previousResume = request.user.resume
    const resume = { url: `/uploads/resumes/${request.file.filename}`, filename: request.file.originalname, uploadedAt: new Date() }
    const user = await User.findByIdAndUpdate(request.user._id, { resume }, { new: true }).select('-password')
    if (previousResume?.url) {
      await unlink(`.${previousResume.url}`).catch((cleanupError) => {
        console.warn(`[Resume] Could not remove previous file: ${cleanupError.message}`)
      })
    }
    return response.status(200).json({ success: true, data: user })
  } catch (error) {
    return next(error)
  }
})

router.get('/saved-jobs', async (request, response, next) => {
  try {
    const savedJobs = await SavedJob.find({ candidate: request.user._id }).populate({ path: 'job', match: { status: 'published' }, select: '-__v' }).sort({ createdAt: -1 }).lean()
    return response.status(200).json({ success: true, data: savedJobs.filter((savedJob) => savedJob.job) })
  } catch (error) {
    return next(error)
  }
})

router.get('/applications', async (request, response, next) => {
  try {
    const applications = await Application.find({ candidate: request.user._id }).populate({ path: 'job', select: '-__v' }).sort({ appliedAt: -1 }).lean()
    return response.status(200).json({ success: true, data: applications })
  } catch (error) {
    return next(error)
  }
})

export default router