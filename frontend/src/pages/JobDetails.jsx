import { ArrowLeft, Bookmark, BriefcaseBusiness, CheckCircle2, Clock3, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import Footer from '../components/Footer'
import LoadingSpinner from '../components/LoadingSpinner'
import Navbar from '../components/Navbar'
import useAuth from '../context/useAuth'
import useToast from '../context/useToast'
import { applyToJob, saveJob } from '../services/candidateApi'
import { getJob } from '../services/jobsApi'

function JobDetails() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showToast } = useToast()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionMessage, setActionMessage] = useState('')

  async function loadJob() {
    setLoading(true)
    setError('')
    try {
      const result = await getJob(jobId)
      setJob(result.data)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadJob() }, [jobId])

  async function apply() {
    if (!user) return navigate('/login', { state: { from: { pathname: `/jobs/${jobId}` } } })
    try {
      await applyToJob(jobId)
      setActionMessage('Application submitted successfully.')
      showToast('Application submitted successfully.')
    } catch (requestError) {
      setActionMessage(requestError.message)
      showToast(requestError.message, 'error')
    }
  }

  async function save() {
    if (!user) return navigate('/login', { state: { from: { pathname: `/jobs/${jobId}` } } })
    try {
      await saveJob(jobId)
      setActionMessage('Job saved to your dashboard.')
      showToast('Job saved to your dashboard.')
    } catch (requestError) {
      setActionMessage(requestError.message)
      showToast(requestError.message, 'error')
    }
  }

  if (loading) return <><Navbar /><LoadingSpinner label="Loading job details" /><Footer /></>
  if (error) return <><Navbar /><main className="mx-auto max-w-3xl px-5 py-20 lg:px-8"><ErrorState message={error} onRetry={loadJob} /></main><Footer /></>
  if (!job) return <div className="bg-[#fbfdfb] text-[#17352b]"><Navbar /><main className="mx-auto max-w-3xl px-5 py-20 lg:px-8"><EmptyState title="Role not found" description="This opportunity may have closed or moved. Explore the latest roles instead." /><Button className="mx-auto mt-6" to="/jobs">Browse all jobs</Button></main><Footer /></div>

  return <div className="bg-[#fbfdfb] text-[#17352b]"><Navbar /><main><section className="border-b border-[#dfeae1] bg-[#edf6ee]"><div className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14"><Link className="inline-flex items-center gap-2 text-sm font-bold text-[#5e7669] hover:text-[#17352b]" to="/jobs"><ArrowLeft size={16} /> Back to jobs</Link><div className="mt-10 flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between"><div><div className={`grid h-14 w-14 place-items-center rounded-2xl text-sm font-black ${job.logoClass}`}>{job.logo}</div><p className="mt-6 text-sm font-bold text-[#28704d]">{job.company}</p><h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold tracking-[-0.03em] sm:text-6xl">{job.title}</h1><div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-[#657a6f]"><span className="flex items-center gap-1.5"><MapPin size={16} />{job.location}</span><span className="flex items-center gap-1.5"><BriefcaseBusiness size={16} />{job.experience}</span><span className="flex items-center gap-1.5"><Clock3 size={16} />{job.posted}</span></div></div><div className="flex gap-2"><Button className="flex-1 sm:flex-none" onClick={apply}>Apply now</Button><Button className="px-3" variant="secondary" aria-label="Save job" onClick={save}><Bookmark size={18} /></Button></div></div>{actionMessage && <p className="mt-5 text-sm font-bold text-[#28704d]">{actionMessage}</p>}</div></section><section className="mx-auto grid max-w-7xl gap-12 px-5 py-12 lg:grid-cols-[1fr_320px] lg:px-8 lg:py-16"><article className="max-w-2xl"><h2 className="font-display text-2xl font-semibold">About the role</h2><p className="mt-5 text-base leading-8 text-[#5e7669]">{job.description}</p><p className="mt-5 text-base leading-8 text-[#5e7669]">You will have room to make this work your own, with a thoughtful team around you and the resources to turn good ideas into lasting outcomes.</p><h2 className="mt-12 font-display text-2xl font-semibold">What you will bring</h2><ul className="mt-5 space-y-4 text-sm leading-6 text-[#5e7669]">{['A track record of thoughtful, high-quality work in your craft.', 'Clear communication and a generous, collaborative working style.', 'Curiosity about the people and problems behind the work.'].map((item) => <li className="flex gap-3" key={item}><CheckCircle2 className="mt-0.5 shrink-0 text-[#28704d]" size={18} />{item}</li>)}</ul></article><aside className="h-fit rounded-2xl border border-[#dbe7de] bg-white p-6"><h2 className="font-display text-xl font-semibold">Role snapshot</h2><dl className="mt-6 space-y-5 text-sm"><div><dt className="text-[#82958a]">Salary range</dt><dd className="mt-1 font-bold text-[#17352b]">{job.salary}</dd></div><div><dt className="text-[#82958a]">Experience</dt><dd className="mt-1 font-bold text-[#17352b]">{job.experience}</dd></div><div><dt className="text-[#82958a]">Job type</dt><dd className="mt-1 font-bold text-[#17352b]">{job.type}</dd></div></dl><div className="mt-7 border-t border-[#edf2ed] pt-6"><p className="text-xs font-black uppercase tracking-[0.12em] text-[#82958a]">Skills</p><div className="mt-3 flex flex-wrap gap-2">{job.skills.map((skill) => <span className="rounded-md bg-[#edf6ee] px-2.5 py-1.5 text-xs font-bold text-[#28704d]" key={skill}>{skill}</span>)}</div></div></aside></section></main><Footer /></div>
}

export default JobDetails
