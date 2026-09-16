import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ErrorState from '../components/ErrorState'
import EmptyState from '../components/EmptyState'
import Footer from '../components/Footer'
import LoadingSpinner from '../components/LoadingSpinner'
import Navbar from '../components/Navbar'
import { getApplicants, updateApplicationStatus } from '../services/recruiterApi'

const statuses = ['applied', 'under-review', 'shortlisted', 'interview', 'selected', 'rejected']
const labels = { applied: 'Applied', 'under-review': 'Under Review', shortlisted: 'Shortlisted', interview: 'Interview', selected: 'Selected', rejected: 'Rejected' }

function RecruiterApplicants() {
  const { jobId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadApplicants() {
    setLoading(true); setError('')
    try { const result = await getApplicants(jobId); setData(result.data) } catch (requestError) { setError(requestError.message) } finally { setLoading(false) }
  }

  useEffect(() => { loadApplicants() }, [jobId])

  async function changeStatus(applicationId, status) {
    try { const result = await updateApplicationStatus(applicationId, status); setData((current) => ({ ...current, applicants: current.applicants.map((item) => item._id === applicationId ? result.data : item) })) } catch (requestError) { setError(requestError.message) }
  }

  return <div className="min-h-screen bg-[#fbfdfb] text-[#17352b]"><Navbar /><main className="mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-16"><Link className="inline-flex items-center gap-2 text-sm font-bold text-[#5e7669]" to="/recruiter/jobs"><ArrowLeft size={16} /> Back to jobs</Link>{loading ? <LoadingSpinner label="Loading applicants" /> : error ? <div className="mt-8"><ErrorState message={error} onRetry={loadApplicants} /></div> : <><p className="eyebrow mt-10">Applicant review</p><h1 className="mt-3 font-display text-5xl font-semibold">{data.job.title}</h1><p className="mt-3 text-sm text-[#82958a]">{data.applicants.length} applicants for {data.job.company}</p><div className="mt-8">{data.applicants.length === 0 ? <EmptyState title="No applicants yet" description="Applicants will appear here when candidates apply." /> : <div className="overflow-hidden rounded-2xl border border-[#dbe7de] bg-white"><div className="divide-y divide-[#edf2ed]">{data.applicants.map((application) => <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between" key={application._id}><div><h2 className="font-display text-xl font-semibold">{application.candidate.name}</h2><p className="mt-1 text-sm text-[#82958a]">{application.candidate.email} · Applied {new Date(application.appliedAt).toLocaleDateString()}</p>{application.candidate.profile?.headline && <p className="mt-2 text-sm text-[#60766a]">{application.candidate.profile.headline}</p>}{application.resume?.url && <a className="mt-2 inline-block text-xs font-bold text-[#28704d] hover:underline" href={application.resume.url}>View resume</a>}</div><label className="text-sm font-bold text-[#29483c]">Status<select className="ml-2 rounded-lg border border-[#cbd9d0] bg-white px-3 py-2 text-sm font-normal" value={application.status} onChange={(event) => changeStatus(application._id, event.target.value)}>{statuses.map((status) => <option value={status} key={status}>{labels[status]}</option>)}</select></label></div>)}</div></div>}</div></>}</main><Footer /></div>
}

export default RecruiterApplicants
