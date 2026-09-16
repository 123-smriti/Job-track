import mongoose from 'mongoose'
import { Router } from 'express'
import Application from '../models/Application.js'
import Job from '../models/Job.js'
import User from '../models/User.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()
const roles = ['candidate', 'recruiter', 'admin']

function parsePage(value, fallback, max) {
  const page = Number.parseInt(value, 10)
  return Number.isInteger(page) && page > 0 ? Math.min(page, max) : fallback
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

router.use(requireAuth, requireRole('admin'))

router.get('/dashboard/stats', async (request, response, next) => {
  try {
    const [totalUsers, totalCandidates, totalRecruiters, totalJobs, totalApplications, activeJobs, selectedCandidates] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'candidate' }),
      User.countDocuments({ role: 'recruiter' }),
      Job.countDocuments(),
      Application.countDocuments(),
      Job.countDocuments({ status: 'published' }),
      Application.countDocuments({ status: 'selected' }),
    ])
    return response.status(200).json({ success: true, data: { totalUsers, totalCandidates, totalRecruiters, totalJobs, totalApplications, activeJobs, selectedCandidates } })
  } catch (error) {
    return next(error)
  }
})

router.get('/users', async (request, response, next) => {
  try {
    const page = parsePage(request.query.page, 1, 10000)
    const limit = parsePage(request.query.limit, 20, 100)
    const filter = {}
    if (roles.includes(request.query.role)) filter.role = request.query.role
    if (request.query.search) {
      const search = escapeRegex(String(request.query.search).trim())
      filter.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }]
    }
    if (request.query.active === 'true' || request.query.active === 'false') filter.isActive = request.query.active === 'true'
    const [users, total] = await Promise.all([
      User.find(filter).select('-password -__v').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      User.countDocuments(filter),
    ])
    return response.status(200).json({ success: true, data: users, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } })
  } catch (error) {
    return next(error)
  }
})

router.patch('/users/:id/status', async (request, response, next) => {
  if (!mongoose.isValidObjectId(request.params.id)) return response.status(400).json({ success: false, message: 'Invalid user ID' })
  if (typeof request.body.isActive !== 'boolean') return response.status(400).json({ success: false, message: 'isActive must be a boolean' })
  if (request.params.id === request.user._id.toString()) return response.status(400).json({ success: false, message: 'You cannot deactivate your own account' })

  try {
    const user = await User.findByIdAndUpdate(request.params.id, { isActive: request.body.isActive }, { new: true }).select('-password -__v')
    if (!user) return response.status(404).json({ success: false, message: 'User not found' })
    return response.status(200).json({ success: true, data: user })
  } catch (error) {
    return next(error)
  }
})

router.get('/recruiters', async (request, response, next) => {
  try {
    const recruiters = await User.find({ role: 'recruiter' }).select('-password -__v').sort({ createdAt: -1 }).lean()
    return response.status(200).json({ success: true, data: recruiters })
  } catch (error) {
    return next(error)
  }
})

router.get('/jobs', async (request, response, next) => {
  try {
    const page = parsePage(request.query.page, 1, 10000)
    const limit = parsePage(request.query.limit, 20, 100)
    const filter = {}
    if (request.query.status) filter.status = request.query.status
    if (request.query.search) filter.$text = { $search: String(request.query.search).trim() }
    const [jobs, total] = await Promise.all([
      Job.find(filter).populate('recruiter', 'name email').select('-__v').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Job.countDocuments(filter),
    ])
    return response.status(200).json({ success: true, data: jobs, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } })
  } catch (error) {
    return next(error)
  }
})

router.delete('/jobs/:id', async (request, response, next) => {
  if (!mongoose.isValidObjectId(request.params.id)) return response.status(400).json({ success: false, message: 'Invalid job ID' })
  try {
    const job = await Job.findByIdAndDelete(request.params.id)
    if (!job) return response.status(404).json({ success: false, message: 'Job not found' })
    return response.status(204).send()
  } catch (error) {
    return next(error)
  }
})

router.get('/applications', async (request, response, next) => {
  try {
    const applications = await Application.find().populate('candidate', 'name email profile').populate('job', 'title company status').sort({ appliedAt: -1 }).lean()
    return response.status(200).json({ success: true, data: applications })
  } catch (error) {
    return next(error)
  }
})

export default router