import { Edit3, Eye, Plus, Trash2, ToggleLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import Footer from '../components/Footer'
import LoadingSpinner from '../components/LoadingSpinner'
import Navbar from '../components/Navbar'
import { deleteJob, getRecruiterJobs, updateJobStatus } from '../services/recruiterApi'

function RecruiterJobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadJobs() {
    setLoading(true); setError('')
    try { const result = await getRecruiterJobs(); setJobs(result.data) } catch (requestError) { setError(requestError.message) } finally { setLoading(false) }
  }

  useEffect(() => { loadJobs() }, [])

  async function toggleStatus(job) {
    const status = job.status === 'published' ? 'closed' : 'published'
    try { const result = await updateJobStatus(job._id, status); setJobs((current) => current.map((item) => item._id === job._id ? result.data : item)) } catch (requestError) { setError(requestError.message) }
  }

  async function removeJob(id) {
    if (!window.confirm('Delete this job and its listing?')) return
    try { await deleteJob(id); setJobs((current) => current.filter((job) => job._id !== id)) } catch (requestError) { setError(requestError.message) }
  }

  return <div className="min-h-screen bg-[#fbfdfb] text-[#17352b]"><Navbar /><main className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16"><div className="flex flex-col justify-between gap-5 border-b border-[#dbe7de] pb-8 sm:flex-row sm:items-end"><div><p className="eyebrow">Recruiter workspace</p><h1 className="mt-3 font-display text-5xl font-semibold">Your jobs</h1><p className="mt-3 text-sm text-[#70847a]">Create, edit, and track every role you own.</p></div><Link className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#17352b] px-4 py-2.5 text-sm font-bold text-white" to="/recruiter/jobs/new"><Plus size={17} /> Post a job</Link></div><div className="mt-8">{loading ? <LoadingSpinner label="Loading your jobs" /> : error ? <ErrorState message={error} onRetry={loadJobs} /> : jobs.length === 0 ? <EmptyState title="No jobs posted yet" description="Create your first job listing to start meeting candidates." /> : <div className="overflow-hidden rounded-2xl border border-[#dbe7de] bg-white"><div className="divide-y divide-[#edf2ed]">{jobs.map((job) => <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between" key={job._id}><div><h2 className="font-display text-xl font-semibold">{job.title}</h2><p className="mt-1 text-sm text-[#82958a]">{job.company} · {job.location}</p><span className={`mt-3 inline-block rounded-full px-2.5 py-1 text-xs font-bold ${job.status === 'published' ? 'bg-[#e4f0e7] text-[#28704d]' : 'bg-[#f3eee3] text-[#8a6a1c]'}`}>{job.status}</span></div><div className="flex flex-wrap gap-2"><Link className="inline-flex items-center gap-1.5 rounded-lg border border-[#cbd9d0] px-3 py-2 text-xs font-bold text-[#29483c]" to={`/recruiter/jobs/${job._id}/applicants`}><Eye size={14} /> Applicants</Link><Link className="inline-flex items-center gap-1.5 rounded-lg border border-[#cbd9d0] px-3 py-2 text-xs font-bold text-[#29483c]" to={`/recruiter/jobs/${job._id}/edit`}><Edit3 size={14} /> Edit</Link><button className="inline-flex items-center gap-1.5 rounded-lg border border-[#cbd9d0] px-3 py-2 text-xs font-bold text-[#29483c]" type="button" onClick={() => toggleStatus(job)}><ToggleLeft size={14} /> {job.status === 'published' ? 'Deactivate' : 'Activate'}</button><button className="inline-flex items-center gap-1.5 rounded-lg border border-[#f0d6ca] px-3 py-2 text-xs font-bold text-[#a34d34]" type="button" onClick={() => removeJob(job._id)}><Trash2 size={14} /> Delete</button></div></div>)}</div></div>}</div></main><Footer /></div>
}

export default RecruiterJobs
