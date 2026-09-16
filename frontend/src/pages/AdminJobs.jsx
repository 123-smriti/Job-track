import { Search, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import ErrorState from '../components/ErrorState'
import EmptyState from '../components/EmptyState'
import Footer from '../components/Footer'
import LoadingSpinner from '../components/LoadingSpinner'
import Navbar from '../components/Navbar'
import { getAdminJobs, removeAdminJob } from '../services/adminApi'

function AdminJobs() {
  const [jobs, setJobs] = useState([]); const [search, setSearch] = useState(''); const [loading, setLoading] = useState(true); const [error, setError] = useState('')
  async function loadJobs() { setLoading(true); setError(''); try { const result = await getAdminJobs({ search }); setJobs(result.data) } catch (requestError) { setError(requestError.message) } finally { setLoading(false) } }
  useEffect(() => { loadJobs() }, [])
  async function removeJob(id) { if (!window.confirm('Remove this job from the platform?')) return; try { await removeAdminJob(id); setJobs((current) => current.filter((job) => job._id !== id)) } catch (requestError) { setError(requestError.message) } }
  return <div className="min-h-screen bg-[#fbfdfb] text-[#17352b]"><Navbar /><main className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16"><p className="eyebrow">Admin workspace</p><h1 className="mt-3 font-display text-5xl font-semibold">Job moderation</h1><div className="mt-8 flex gap-3"><label className="flex flex-1 items-center gap-2 rounded-lg border border-[#cbd9d0] bg-white px-3"><Search size={17} className="text-[#82958a]" /><input className="w-full bg-transparent py-3 text-sm outline-none" placeholder="Search jobs" value={search} onChange={(event) => setSearch(event.target.value)} /></label><button className="rounded-lg bg-[#17352b] px-4 py-2 text-sm font-bold text-white" type="button" onClick={loadJobs}>Search</button></div><div className="mt-8">{loading ? <LoadingSpinner label="Loading jobs" /> : error ? <ErrorState message={error} onRetry={loadJobs} /> : jobs.length === 0 ? <EmptyState title="No jobs found" /> : <div className="overflow-hidden rounded-2xl border border-[#dbe7de] bg-white"><div className="divide-y divide-[#edf2ed]">{jobs.map((job) => <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between" key={job._id}><div><h2 className="font-display text-xl font-semibold">{job.title}</h2><p className="mt-1 text-sm text-[#82958a]">{job.company} · {job.recruiter?.name || 'Unknown recruiter'}</p><span className="mt-3 inline-block rounded-full bg-[#e4f0e7] px-2.5 py-1 text-xs font-bold text-[#28704d]">{job.status}</span></div><button className="inline-flex w-fit items-center gap-2 rounded-lg border border-[#f0d6ca] px-3 py-2 text-xs font-bold text-[#a34d34]" type="button" onClick={() => removeJob(job._id)}><Trash2 size={14} /> Remove job</button></div>)}</div></div>}</div></main><Footer /></div>
}

export default AdminJobs
