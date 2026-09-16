import mongoose from 'mongoose'

const { Schema } = mongoose

const salarySchema = new Schema({
  min: { type: Number, min: 0 },
  max: { type: Number, min: 0 },
  currency: { type: String, trim: true, uppercase: true, default: 'USD' },
  period: { type: String, enum: ['hour', 'year'], default: 'year' },
}, { _id: false })

const jobSchema = new Schema({
  title: { type: String, required: true, trim: true, maxlength: 160 },
  company: { type: String, required: true, trim: true, maxlength: 160 },
  description: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true, index: true },
  salary: { type: salarySchema, default: null },
  experience: { type: String, required: true, trim: true },
  skills: [{ type: String, trim: true, index: true }],
  jobType: { type: String, enum: ['full-time', 'part-time', 'contract', 'internship'], default: 'full-time', index: true },
  workMode: { type: String, enum: ['on-site', 'hybrid', 'remote'], default: 'on-site', index: true },
  recruiter: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  status: { type: String, enum: ['draft', 'published', 'closed'], default: 'draft', index: true },
}, { timestamps: true })

jobSchema.index({ title: 'text', company: 'text', description: 'text', skills: 'text' })
jobSchema.index({ status: 1, location: 1, createdAt: -1 })

export default mongoose.model('Job', jobSchema)
