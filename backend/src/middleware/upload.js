import multer from 'multer'
import path from 'node:path'
import { mkdirSync } from 'node:fs'

const uploadDirectory = path.resolve('uploads/resumes')
mkdirSync(uploadDirectory, { recursive: true })

const storage = multer.diskStorage({
  destination: uploadDirectory,
  filename: (request, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase()
    callback(null, `${request.user._id}-${Date.now()}${extension}`)
  },
})

const allowedMimeTypes = new Set(['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])

export const resumeUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (request, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) return callback(new Error('Resume must be a PDF or Word document'))
    return callback(null, true)
  },
})