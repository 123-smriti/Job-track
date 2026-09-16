import mongoose from 'mongoose'

const { Schema } = mongoose

const profileSchema = new Schema({
  headline: { type: String, trim: true, maxlength: 160 },
  bio: { type: String, trim: true, maxlength: 2000 },
  phone: { type: String, trim: true },
  location: { type: String, trim: true },
  skills: [{ type: String, trim: true }],
}, { _id: false })

const resumeSchema = new Schema({
  url: { type: String, trim: true },
  filename: { type: String, trim: true },
  uploadedAt: Date,
}, { _id: false })

const userSchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['candidate', 'recruiter', 'admin'], default: 'candidate', index: true },
  isActive: { type: Boolean, default: true, index: true },
  profile: { type: profileSchema, default: () => ({}) },
  resume: { type: resumeSchema, default: null },
}, { timestamps: true })

export default mongoose.model('User', userSchema)
