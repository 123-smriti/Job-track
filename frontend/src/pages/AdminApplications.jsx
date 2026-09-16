import { useEffect, useState } from 'react'
import ErrorState from '../components/ErrorState'
import EmptyState from '../components/EmptyState'
import Footer from '../components/Footer'
import LoadingSpinner from '../components/LoadingSpinner'
import Navbar from '../components/Navbar'
import { getAdminApplications } from '../services/adminApi'

const labels = { applied: 'Applied', 'under-review': 'Under Review', shortlisted: 'Shortlisted', interview: 'Interview', selected: 'Selected', rejected: 'Rejected' }

function AdminApplications() {
  const [applications, setApplications] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('')
  async function loadApplications() { setLoading(true); setError(''); try { const result = await getAdminApplications(); setApplications(result.data) } catch (requestError) { setError(requestError.message) } finally { setLoading(false) } }
  useEffect(() => { loadApplications() }, [])
  return <div className="min-h-screen bg-[#fbfdfb] text-[#17352b]"><Navbar /><main className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16"><p className="eyebrow">Admin workspace</p><h1 className="mt-3 font-display text-5xl font-semibold">Applications</h1><div className="mt-8">{loading ? <LoadingSpinner label="Loading applications" /> : error ? <ErrorState message={error} onRetry={loadApplications} /> : applications.length === 0 ? <EmptyState title="No applications found" /> : <div className="overflow-x-auto rounded-2xl border border-[#dbe7de] bg-white"><table className="w-full min-w-[720px] text-left text-sm"><thead className="border-b border-[#edf2ed] text-xs uppercase tracking-wider text-[#82958a]"><tr><th className="p-4">Candidate</th><th className="p-4">Job</th><th className="p-4">Status</th><th className="p-4">Applied</th></tr></thead><tbody className="divide-y divide-[#edf2ed]">{applications.map((application) => <tr key={application._id}><td className="p-4"><p className="font-bold">{application.candidate?.name}</p><p className="text-xs text-[#82958a]">{application.candidate?.email}</p></td><td className="p-4">{application.job?.title}<p className="text-xs text-[#82958a]">{application.job?.company}</p></td><td className="p-4"><span className="rounded-full bg-[#e4f0e7] px-2.5 py-1 text-xs font-bold text-[#28704d]">{labels[application.status] || application.status}</span></td><td className="p-4 text-[#70847a]">{new Date(application.appliedAt).toLocaleDateString()}</td></tr>)}</tbody></table></div>}</div></main><Footer /></div>
}

export default AdminApplications
