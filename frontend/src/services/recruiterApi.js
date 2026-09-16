const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, { credentials: 'include', ...options })
  const data = response.status === 204 ? {} : await response.json()
  if (!response.ok) throw new Error(data.message || 'Recruiter request failed')
  return data
}

export const getRecruiterStats = () => request('/api/recruiter/dashboard/stats')
export const getRecruiterJobs = () => request('/api/recruiter/jobs')
export const getApplicants = (jobId) => request(`/api/recruiter/jobs/${jobId}/applicants`)
export const updateApplicationStatus = (id, status) => request(`/api/recruiter/applications/${id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
export const createJob = (job) => request('/api/jobs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(job) })
export const updateJob = (id, job) => request(`/api/jobs/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(job) })
export const deleteJob = (id) => request(`/api/jobs/${id}`, { method: 'DELETE' })
export const updateJobStatus = (id, status) => request(`/api/jobs/${id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
