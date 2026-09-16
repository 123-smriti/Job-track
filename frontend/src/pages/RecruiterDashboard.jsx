import { BriefcaseBusiness, CheckCircle2, FileText, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ErrorState from '../components/ErrorState'
import Footer from '../components/Footer'
import LoadingSpinner from '../components/LoadingSpinner'
import Navbar from '../components/Navbar'
import useAuth from '../context/useAuth'
import { getRecruiterStats } from '../services/recruiterApi'

const cards = [{ key: 'totalJobs', label: 'Total jobs', icon: BriefcaseBusiness }, { key: 'activeJobs', label: 'Active jobs', icon: CheckCircle2 }, { key: 'totalApplications', label: 'Applications', icon: FileText }, { key: 'shortlisted', label: 'Shortlisted', icon: Users }, { key: 'interviews', label: 'Interviews', icon: Users }, { key: 'selected', label: 'Selected', icon: CheckCircle2 }]

function RecruiterDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  async function loadStats() {
    setLoading(true); setError('')
    try { const result = await getRecruiterStats(); setStats(result.data) } catch (requestError) { setError(requestError.message) } finally { setLoading(false) }
  }

  useEffect(() => { loadStats() }, [])

  return <div className="min-h-screen bg-[#fbfdfb] text-[#17352b]"><Navbar /><main className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16"><div className="flex flex-col justify-between gap-5 border-b border-[#dbe7de] pb-8 sm:flex-row sm:items-end"><div><p className="eyebrow">Recruiter workspace</p><h1 className="mt-3 font-display text-5xl font-semibold tracking-[-0.035em]">Good morning, {user.name}.</h1><p className="mt-3 text-sm text-[#70847a]">A clear view of your hiring momentum.</p></div><div className="flex gap-2"><Link className="rounded-lg border border-[#cbd9d0] bg-white px-4 py-2.5 text-sm font-bold text-[#29483c]" to="/recruiter/jobs">Manage jobs</Link><Link className="rounded-lg bg-[#17352b] px-4 py-2.5 text-sm font-bold text-white" to="/recruiter/jobs/new">Post a job</Link></div></div>{loading ? <LoadingSpinner label="Loading recruiting stats" /> : error ? <div className="mt-8"><ErrorState message={error} onRetry={loadStats} /></div> : <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{cards.map(({ key, label, icon: Icon }) => <div className="rounded-2xl border border-[#dbe7de] bg-white p-6" key={key}><Icon className="text-[#28704d]" size={21} /><p className="mt-8 font-display text-4xl font-semibold">{stats[key]}</p><p className="mt-2 text-sm text-[#82958a]">{label}</p></div>)}</div>}</main><Footer /></div>
}

export default RecruiterDashboard
