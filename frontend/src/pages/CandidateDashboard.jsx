import { FileText, Heart, LoaderCircle, Save, Upload, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import Footer from '../components/Footer'
import JobCard from '../components/JobCard'
import Navbar from '../components/Navbar'
import useAuth from '../context/useAuth'
import { getApplications, getProfile, getSavedJobs, uploadResume } from '../services/candidateApi'
import { normalizeJob } from '../services/jobsApi'

const statusLabels = { applied: 'Applied', 'under-review': 'Under Review', shortlisted: 'Shortlisted', interview: 'Interview', selected: 'Selected', rejected: 'Rejected' }

function CandidateDashboard() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [savedJobs, setSavedJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')

  async function loadDashboard() {
    setLoading(true)
    setError('')
    try {
      const [profileResult, savedResult, applicationsResult] = await Promise.all([getProfile(), getSavedJobs(), getApplications()])
      setProfile(profileResult.data)
      setSavedJobs(savedResult.data)
      setApplications(applicationsResult.data)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadDashboard() }, [])

  async function handleResume(event) {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadMessage('')
    try {
      const result = await uploadResume(file)
      setProfile(result.data)
      setUploadMessage('Resume uploaded successfully.')
    } catch (requestError) {
      setUploadMessage(requestError.message)
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  if (loading) return <><Navbar /><LoadingDashboard /><Footer /></>
  if (error) return <><Navbar /><main className="mx-auto max-w-5xl px-5 py-20 lg:px-8"><ErrorState message={error} onRetry={loadDashboard} /></main><Footer /></>

  const currentProfile = profile || user
  return <div className="min-h-screen bg-[#fbfdfb] text-[#17352b]"><Navbar /><main className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16"><div className="flex flex-col justify-between gap-5 border-b border-[#dbe7de] pb-8 sm:flex-row sm:items-end"><div><p className="eyebrow">Candidate dashboard</p><h1 className="mt-3 font-display text-5xl font-semibold tracking-[-0.035em]">Hello, {currentProfile.name}.</h1><p className="mt-3 text-sm text-[#70847a]">Keep your search, profile, and applications in one place.</p></div><Button to="/jobs">Browse jobs</Button></div><div className="mt-8 grid gap-5 lg:grid-cols-[0.75fr_1.25fr]"><section className="rounded-2xl border border-[#dbe7de] bg-white p-6"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#e4f0e7] text-[#28704d]"><UserRound size={18} /></span><div><h2 className="font-display text-xl font-semibold">Your profile</h2><p className="text-xs text-[#82958a]">{currentProfile.email}</p></div></div><div className="mt-6 space-y-3 text-sm text-[#60766a]"><p><strong className="text-[#29483c]">Location:</strong> {currentProfile.profile?.location || 'Add your location'}</p><p><strong className="text-[#29483c]">Headline:</strong> {currentProfile.profile?.headline || 'Add a professional headline'}</p></div><Button className="mt-6 w-full" variant="secondary" to="/account">Manage profile</Button></section><section className="rounded-2xl border border-[#dbe7de] bg-white p-6"><div className="flex items-center justify-between gap-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#e4f0e7] text-[#28704d]"><FileText size={18} /></span><div><h2 className="font-display text-xl font-semibold">Resume</h2><p className="text-xs text-[#82958a]">PDF or Word document, up to 5 MB</p></div></div><label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#17352b] px-3 py-2 text-xs font-bold text-white hover:bg-[#245544]"><Upload size={14} /> {uploading ? 'Uploading...' : 'Upload'}<input className="sr-only" type="file" accept=".pdf,.doc,.docx" onChange={handleResume} disabled={uploading} /></label></div>{profile?.resume ? <p className="mt-7 rounded-lg bg-[#edf6ee] px-3 py-2.5 text-sm font-semibold text-[#28704d]">{profile.resume.filename}</p> : <p className="mt-7 text-sm text-[#82958a]">No resume uploaded yet.</p>}{uploadMessage && <p className="mt-3 text-sm font-semibold text-[#28704d]">{uploadMessage}</p>}</section></div><section className="mt-8"><div className="flex items-center justify-between"><h2 className="flex items-center gap-2 font-display text-2xl font-semibold"><Heart className="text-[#28704d]" size={20} />Saved jobs <span className="text-sm font-sans font-bold text-[#82958a]">({savedJobs.length})</span></h2></div><div className="mt-5">{savedJobs.length ? <div className="grid gap-4 md:grid-cols-2">{savedJobs.map((saved) => <JobCard key={saved._id} job={normalizeJob(saved.job)} />)}</div> : <EmptyState title="No saved jobs yet" description="Save roles that match your next move and they will appear here." />}</div></section><section className="mt-10"><h2 className="flex items-center gap-2 font-display text-2xl font-semibold"><Save className="text-[#28704d]" size={20} />Application tracker <span className="text-sm font-sans font-bold text-[#82958a]">({applications.length})</span></h2><div className="mt-5 overflow-hidden rounded-2xl border border-[#dbe7de] bg-white">{applications.length ? <div className="divide-y divide-[#edf2ed]">{applications.map((application) => <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between" key={application._id}><div><Link className="font-display text-lg font-semibold text-[#17352b] hover:text-[#28704d]" to={`/jobs/${application.job?._id}`}>{application.job?.title || 'Job'}</Link><p className="mt-1 text-sm text-[#82958a]">{application.job?.company || 'Company'} · {new Date(application.appliedAt).toLocaleDateString()}</p></div><span className="w-fit rounded-full bg-[#e4f0e7] px-3 py-1.5 text-xs font-black text-[#28704d]">{statusLabels[application.status] || application.status}</span></div>)}</div> : <EmptyState title="No applications yet" description="When you apply to a role, its progress will be tracked here." />}</div></section></main><Footer /></div>
}

function LoadingDashboard() { return <main className="mx-auto max-w-5xl px-5 py-20 lg:px-8"><div className="flex items-center justify-center gap-3 text-sm font-semibold text-[#597267]"><LoaderCircle className="animate-spin" size={20} /> Loading your dashboard</div></main> }

export default CandidateDashboard
