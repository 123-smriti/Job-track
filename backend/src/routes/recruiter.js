import mongoose from 'mongoose'
import { Router } from 'express'
import Application from '../models/Application.js'
import Job from '../models/Job.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()
const applicationStatuses = ['applied', 'under-review', 'shortlisted', 'interview', 'selected', 'rejected']

function isValidId(id) {
  return mongoose.isValidObjectId(id)
}

router.use(requireAuth, requireRole('recruiter'))

router.get('/dashboard/stats', async (request, response, next) => {
  try {
    const jobs = await Job.find({ recruiter: request.user._id }).select('_id status').lean()
    const jobIds = jobs.map((job) => job._id)
    const applicationCounts = await Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ])
    const counts = Object.fromEntries(applicationCounts.map((item) => [item._id, item.count]))
    const totalApplications = await Application.countDocuments({ job: { $in: jobIds } })

    return response.status(200).json({
      success: true,
      data: {
        totalJobs: jobs.length,
        activeJobs: jobs.filter((job) => job.status === 'published').length,
        totalApplications,
        shortlisted: counts.shortlisted || 0,
        interviews: counts.interview || 0,
        selected: counts.selected || 0,
      },
    })
  } catch (error) {
    return next(error)
  }
})

router.get('/jobs', async (request, response, next) => {
  try {
    const jobs = await Job.find({ recruiter: request.user._id }).sort({ createdAt: -1 }).select('-__v').lean()
    return response.status(200).json({ success: true, data: jobs })
  } catch (error) {
    return next(error)
  }
})

router.get('/jobs/:id/applicants', async (request, response, next) => {
  if (!isValidId(request.params.id)) return response.status(400).json({ success: false, message: 'Invalid job ID' })

  try {
    const job = await Job.findOne({ _id: request.params.id, recruiter: request.user._id }).select('title company').lean()
    if (!job) return response.status(404).json({ success: false, message: 'Job not found' })

    const applicants = await Application.find({ job: job._id }).populate({ path: 'candidate', select: 'name email profile' }).sort({ appliedAt: -1 }).lean()
    return response.status(200).json({ success: true, data: { job, applicants } })
  } catch (error) {
    return next(error)
  }
})

router.patch('/applications/:id/status', async (request, response, next) => {
  if (!isValidId(request.params.id)) return response.status(400).json({ success: false, message: 'Invalid application ID' })
  if (!applicationStatuses.includes(request.body.status)) return response.status(400).json({ success: false, message: 'Invalid application status' })

  try {
    const application = await Application.findById(request.params.id).populate({ path: 'job', select: 'recruiter' })
    if (!application || application.job.recruiter.toString() !== request.user._id.toString()) {
      return response.status(404).json({ success: false, message: 'Application not found' })
    }

    application.status = request.body.status
    await application.save()
    return response.status(200).json({ success: true, data: application })
  } catch (error) {
    return next(error)
  }
})

export default router
