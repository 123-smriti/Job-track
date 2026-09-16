const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, { credentials: 'include', ...options })
  const data = response.status === 204 ? {} : await response.json()
  if (!response.ok) throw new Error(data.message || 'Unable to complete this request')
  return data
}

export function getProfile() { return request('/api/users/profile') }
export function updateProfile(profile) { return request('/api/users/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profile) }) }
export function getSavedJobs() { return request('/api/users/saved-jobs') }
export function getApplications() { return request('/api/users/applications') }
export function uploadResume(file) { const formData = new FormData(); formData.append('resume', file); return request('/api/users/resume', { method: 'POST', body: formData }) }
export function saveJob(id) { return request(`/api/jobs/${id}/save`, { method: 'POST' }) }
export function removeSavedJob(id) { return request(`/api/jobs/${id}/save`, { method: 'DELETE' }) }
export function applyToJob(id) { return request(`/api/jobs/${id}/apply`, { method: 'POST' }) }
