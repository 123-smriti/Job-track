import mongoose from 'mongoose'

const { Schema } = mongoose

const savedJobSchema = new Schema({
  candidate: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  job: { type: Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
}, { timestamps: true })

savedJobSchema.index({ candidate: 1, job: 1 }, { unique: true })
savedJobSchema.index({ candidate: 1, createdAt: -1 })

export default mongoose.model('SavedJob', savedJobSchema)
