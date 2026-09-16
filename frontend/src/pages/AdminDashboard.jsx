import { BriefcaseBusiness, CheckCircle2, FileText, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ErrorState from '../components/ErrorState'
import Footer from '../components/Footer'
import LoadingSpinner from '../components/LoadingSpinner'
import Navbar from '../components/Navbar'
import useAuth from '../context/useAuth'
import { getAdminStats } from '../services/adminApi'

const cards = [['totalUsers', 'Total users', Users], ['totalCandidates', 'Candidates', Users], ['totalRecruiters', 'Recruiters', Users], ['totalJobs', 'Total jobs', BriefcaseBusiness], ['totalApplications', 'Applications', FileText], ['activeJobs', 'Active jobs', CheckCircle2], ['selectedCandidates', 'Selected candidates', CheckCircle2]]

function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  async function loadStats() { setLoading(true); setError(''); try { const result = await getAdminStats(); setStats(result.data) } catch (requestError) { setError(requestError.message) } finally { setLoading(false) } }
  useEffect(() => { loadStats() }, [])
  return <div className="min-h-screen bg-[#fbfdfb] text-[#17352b]"><Navbar /><main className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16"><div className="flex flex-col justify-between gap-5 border-b border-[#dbe7de] pb-8 sm:flex-row sm:items-end"><div><p className="eyebrow">Admin workspace</p><h1 className="mt-3 font-display text-5xl font-semibold">Platform overview</h1><p className="mt-3 text-sm text-[#70847a]">Monitor the health of JobTrack, {user.name}.</p></div><div className="flex flex-wrap gap-2"><Link className="rounded-lg border border-[#cbd9d0] bg-white px-3 py-2 text-sm font-bold" to="/admin/users">Manage users</Link><Link className="rounded-lg bg-[#17352b] px-3 py-2 text-sm font-bold text-white" to="/admin/jobs">Review jobs</Link></div></div>{loading ? <LoadingSpinner label="Loading platform stats" /> : error ? <div className="mt-8"><ErrorState message={error} onRetry={loadStats} /></div> : <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{cards.map(([key, label, Icon]) => <div className="rounded-2xl border border-[#dbe7de] bg-white p-5" key={key}><Icon className="text-[#28704d]" size={20} /><p className="mt-8 font-display text-3xl font-semibold">{stats[key]}</p><p className="mt-2 text-sm text-[#82958a]">{label}</p></div>)}</div>}</main><Footer /></div>
}

export default AdminDashboard
