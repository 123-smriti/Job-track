const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, { credentials: 'include', ...options })
  const data = response.status === 204 ? {} : await response.json()
  if (!response.ok) throw new Error(data.message || 'Admin request failed')
  return data
}

export const getAdminStats = () => request('/api/admin/dashboard/stats')
export const getAdminUsers = (params = {}) => request(`/api/admin/users?${new URLSearchParams(params)}`)
export const getAdminRecruiters = () => request('/api/admin/recruiters')
export const updateUserStatus = (id, isActive) => request(`/api/admin/users/${id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive }) })
export const getAdminJobs = (params = {}) => request(`/api/admin/jobs?${new URLSearchParams(params)}`)
export const removeAdminJob = (id) => request(`/api/admin/jobs/${id}`, { method: 'DELETE' })
export const getAdminApplications = () => request('/api/admin/applications')
