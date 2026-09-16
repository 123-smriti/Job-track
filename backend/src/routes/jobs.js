import mongoose from 'mongoose'
import { Router } from 'express'
import Job from '../models/Job.js'
import Application from '../models/Application.js'
import SavedJob from '../models/SavedJob.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()
const allowedStatuses = ['draft', 'published', 'closed']
const allowedJobTypes = ['full-time', 'part-time', 'contract', 'internship']
const allowedWorkModes = ['on-site', 'hybrid', 'remote']

function parsePositiveInteger(value, fallback, maximum) {
  const parsed = Number.parseInt(value, 10)
  if (!Number.isInteger(parsed) || parsed < 1) return fallback
  return Math.min(parsed, maximum)
}

function normalizeSkills(skills) {
  if (Array.isArray(skills)) return skills.map((skill) => String(skill).trim()).filter(Boolean)
  if (typeof skills === 'string') return skills.split(',').map((skill) => skill.trim()).filter(Boolean)
  return []
}

function validateJobPayload(body, partial = false) {
  const requiredFields = ['title', 'company', 'description', 'location', 'experience']
  if (!partial && requiredFields.some((field) => typeof body[field] !== 'string' || !body[field].trim())) {
    return 'Title, company, description, location, and experience are required'
  }

  if (body.jobType !== undefined && !allowedJobTypes.includes(body.jobType)) return 'Invalid job type'
  if (body.workMode !== undefined && !allowedWorkModes.includes(body.workMode)) return 'Invalid work mode'
  if (body.status !== undefined && !allowedStatuses.includes(body.status)) return 'Invalid job status'
  if (body.skills !== undefined && !normalizeSkills(body.skills).length) return 'At least one skill is required'
  if (body.salary !== undefined && body.salary !== null) {
    const minimum = body.salary?.min === undefined ? undefined : Number(body.salary.min)
    const maximum = body.salary?.max === undefined ? undefined : Number(body.salary.max)
    if (typeof body.salary !== 'object' || (minimum !== undefined && (!Number.isFinite(minimum) || minimum < 0)) || (maximum !== undefined && (!Number.isFinite(maximum) || maximum < 0)) || (minimum !== undefined && maximum !== undefined && maximum < minimum)) {
      return 'Salary must contain non-negative min and max values'
    }
  }

  return null
}

function buildJobPayload(body) {
  const allowedFields = ['title', 'company', 'description', 'location', 'experience', 'skills', 'jobType', 'workMode', 'status', 'salary']
  const payload = Object.fromEntries(Object.entries(body).filter(([key]) => allowedFields.includes(key)))
  if (body.skills !== undefined) payload.skills = normalizeSkills(body.skills)
  if (body.salary !== undefined && body.salary !== null) {
    payload.salary = {
      min: body.salary.min === undefined ? undefined : Number(body.salary.min),
      max: body.salary.max === undefined ? undefined : Number(body.salary.max),
      currency: body.salary.currency,
      period: body.salary.period,
    }
  }
  return payload
}

function isValidId(id) {
  return mongoose.isValidObjectId(id)
}

router.get('/', async (request, response, next) => {
  try {
    const page = parsePositiveInteger(request.query.page, 1, 10000)
    const limit = parsePositiveInteger(request.query.limit, 10, 50)
    const filter = { status: 'published' }
    const search = typeof request.query.search === 'string' ? request.query.search.trim() : ''
    const location = typeof request.query.location === 'string' ? request.query.location.trim() : ''
    const experience = typeof request.query.experience === 'string' ? request.query.experience.trim() : ''
    const skills = typeof request.query.skills === 'string' ? normalizeSkills(request.query.skills) : []
    const sort = request.query.sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 }

    if (search) filter.$text = { $search: search }
    if (location) filter.location = { $regex: location, $options: 'i' }
    if (experience) filter.experience = { $regex: experience, $options: 'i' }
    if (request.query.jobType && allowedJobTypes.includes(request.query.jobType)) filter.jobType = request.query.jobType
    if (request.query.workMode && allowedWorkModes.includes(request.query.workMode)) filter.workMode = request.query.workMode
    if (skills.length) filter.skills = { $all: skills }
    const minSalary = Number(request.query.minSalary)
    const maxSalary = Number(request.query.maxSalary)
    if (request.query.minSalary && Number.isFinite(minSalary) && minSalary >= 0) filter['salary.max'] = { $gte: minSalary }
    if (request.query.maxSalary && Number.isFinite(maxSalary) && maxSalary >= 0) filter['salary.min'] = { $lte: maxSalary }

    const [jobs, total] = await Promise.all([
      Job.find(filter).select('-__v').sort(sort).skip((page - 1) * limit).limit(limit).lean(),
      Job.countDocuments(filter),
    ])

    return response.status(200).json({ success: true, data: jobs, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } })
  } catch (error) {
    return next(error)
  }
})

router.get('/:id', async (request, response, next) => {
  if (!isValidId(request.params.id)) return response.status(400).json({ success: false, message: 'Invalid job ID' })

  try {
    const job = await Job.findOne({ _id: request.params.id, status: 'published' }).select('-__v').lean()
    if (!job) return response.status(404).json({ success: false, message: 'Job not found' })
    return response.status(200).json({ success: true, data: job })
  } catch (error) {
    return next(error)
  }
})

router.post('/:id/save', requireAuth, requireRole('candidate'), async (request, response, next) => {
  if (!isValidId(request.params.id)) return response.status(400).json({ success: false, message: 'Invalid job ID' })

  try {
    const job = await Job.findOne({ _id: request.params.id, status: 'published' }).select('_id')
    if (!job) return response.status(404).json({ success: false, message: 'Job not found' })
    const savedJob = await SavedJob.create({ candidate: request.user._id, job: job._id })
    return response.status(201).json({ success: true, data: savedJob })
  } catch (error) {
    if (error.code === 11000) return response.status(409).json({ success: false, message: 'Job is already saved' })
    return next(error)
  }
})

router.delete('/:id/save', requireAuth, requireRole('candidate'), async (request, response, next) => {
  if (!isValidId(request.params.id)) return response.status(400).json({ success: false, message: 'Invalid job ID' })

  try {
    const result = await SavedJob.findOneAndDelete({ candidate: request.user._id, job: request.params.id })
    if (!result) return response.status(404).json({ success: false, message: 'Saved job not found' })
    return response.status(204).send()
  } catch (error) {
    return next(error)
  }
})

router.post('/:id/apply', requireAuth, requireRole('candidate'), async (request, response, next) => {
  if (!isValidId(request.params.id)) return response.status(400).json({ success: false, message: 'Invalid job ID' })

  try {
    const job = await Job.findOne({ _id: request.params.id, status: 'published' }).select('_id')
    if (!job) return response.status(404).json({ success: false, message: 'Job not found or is inactive' })
    const application = await Application.create({ candidate: request.user._id, job: job._id, resume: request.user.resume })
    return response.status(201).json({ success: true, data: application })
  } catch (error) {
    if (error.code === 11000) return response.status(409).json({ success: false, message: 'You have already applied to this job' })
    return next(error)
  }
})

router.post('/', requireAuth, requireRole('recruiter'), async (request, response, next) => {
  try {
    const validationError = validateJobPayload(request.body)
    if (validationError) return response.status(400).json({ success: false, message: validationError })

    const job = await Job.create({ ...buildJobPayload(request.body), recruiter: request.user._id })
    return response.status(201).json({ success: true, data: job })
  } catch (error) {
    return next(error)
  }
})

router.put('/:id', requireAuth, requireRole('recruiter'), async (request, response, next) => {
  if (!isValidId(request.params.id)) return response.status(400).json({ success: false, message: 'Invalid job ID' })

  try {
    const validationError = validateJobPayload(request.body, true)
    if (validationError) return response.status(400).json({ success: false, message: validationError })
    const job = await Job.findOne({ _id: request.params.id, recruiter: request.user._id })
    if (!job) return response.status(404).json({ success: false, message: 'Job not found' })

    Object.assign(job, buildJobPayload(request.body))
    await job.save()
    return response.status(200).json({ success: true, data: job })
  } catch (error) {
    return next(error)
  }
})

router.delete('/:id', requireAuth, requireRole('recruiter'), async (request, response, next) => {
  if (!isValidId(request.params.id)) return response.status(400).json({ success: false, message: 'Invalid job ID' })

  try {
    const job = await Job.findOneAndDelete({ _id: request.params.id, recruiter: request.user._id })
    if (!job) return response.status(404).json({ success: false, message: 'Job not found' })
    return response.status(204).send()
  } catch (error) {
    return next(error)
  }
})

router.patch('/:id/status', requireAuth, requireRole('recruiter'), async (request, response, next) => {
  if (!isValidId(request.params.id)) return response.status(400).json({ success: false, message: 'Invalid job ID' })
  if (!allowedStatuses.includes(request.body.status)) return response.status(400).json({ success: false, message: 'Invalid job status' })

  try {
    const job = await Job.findOneAndUpdate({ _id: request.params.id, recruiter: request.user._id }, { status: request.body.status }, { new: true, runValidators: true }).select('-__v')
    if (!job) return response.status(404).json({ success: false, message: 'Job not found' })
    return response.status(200).json({ success: true, data: job })
  } catch (error) {
    return next(error)
  }
})

export default router