import mongoose from 'mongoose'

const { Schema } = mongoose

const resumeSnapshotSchema = new Schema({
  url: { type: String, trim: true },
  filename: { type: String, trim: true },
}, { _id: false })

const applicationSchema = new Schema({
  candidate: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  job: { type: Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
  resume: { type: resumeSnapshotSchema, default: null },
  status: { type: String, enum: ['applied', 'under-review', 'shortlisted', 'interview', 'selected', 'rejected'], default: 'applied', index: true },
  appliedAt: { type: Date, default: Date.now, index: true },
}, { timestamps: true })

applicationSchema.index({ candidate: 1, job: 1 }, { unique: true })
applicationSchema.index({ job: 1, status: 1, appliedAt: -1 })

export default mongoose.model('Application', applicationSchema)
