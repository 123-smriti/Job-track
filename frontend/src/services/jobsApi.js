const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, { credentials: 'include', ...options })
  const data = response.status === 204 ? {} : await response.json()
  if (!response.ok) throw new Error(data.message || 'Unable to load jobs')
  return data
}

function formatJobType(type) {
  if (!type) return 'Full-time'
  return type.split('-').map((part) => part[0].toUpperCase() + part.slice(1)).join('-')
}

function getInitials(value = '') {
  return value.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'JT'
}

export function normalizeJob(job) {
  const salary = job.salary?.min || job.salary?.max
    ? `$${job.salary.min || 0}k - $${job.salary.max || 0}k`
    : 'Salary not disclosed'

  return {
    ...job,
    id: job._id || job.id,
    logo: getInitials(job.company),
    logoClass: 'bg-[#e3f0e6] text-[#1f6747]',
    type: formatJobType(job.jobType || job.type),
    posted: job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently posted',
    salary,
    skills: job.skills || [],
  }
}

export async function getJobs(params = {}) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.set(key, value)
  })
  const data = await request(`/api/jobs?${query.toString()}`)
  return { ...data, data: data.data.map(normalizeJob) }
}

export async function getJob(id) {
  const data = await request(`/api/jobs/${id}`)
  return { ...data, data: normalizeJob(data.data) }
}
