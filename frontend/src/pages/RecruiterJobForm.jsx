import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Button from '../components/Button'
import ErrorState from '../components/ErrorState'
import Footer from '../components/Footer'
import Input from '../components/Input'
import LoadingSpinner from '../components/LoadingSpinner'
import Navbar from '../components/Navbar'
import { createJob, getRecruiterJobs, updateJob } from '../services/recruiterApi'

const emptyJob = { title: '', company: '', description: '', location: '', experience: '', skills: '', jobType: 'full-time', workMode: 'on-site', status: 'draft', salary: { min: '', max: '', currency: 'USD', period: 'year' } }

function RecruiterJobForm() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const editing = Boolean(jobId)
  const [form, setForm] = useState(emptyJob)
  const [loading, setLoading] = useState(editing)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!editing) return
    getRecruiterJobs().then((result) => {
      const job = result.data.find((item) => item._id === jobId)
      if (!job) throw new Error('Job not found')
      setForm({ ...job, skills: job.skills.join(', '), salary: { ...emptyJob.salary, ...job.salary } })
    }).catch((requestError) => setError(requestError.message)).finally(() => setLoading(false))
  }, [editing, jobId])

  function updateField(event) {
    const { name, value } = event.target
    if (name.startsWith('salary.')) return setForm((current) => ({ ...current, salary: { ...current.salary, [name.split('.')[1]]: value } }))
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function submit(event) {
    event.preventDefault(); setSaving(true); setError('')
    const payload = { ...form, salary: { ...form.salary, min: Number(form.salary.min), max: Number(form.salary.max) }, skills: form.skills.split(',').map((skill) => skill.trim()).filter(Boolean) }
    try { if (editing) await updateJob(jobId, payload); else await createJob(payload); navigate('/recruiter/jobs') } catch (requestError) { setError(requestError.message) } finally { setSaving(false) }
  }

  if (loading) return <><Navbar /><LoadingSpinner label="Loading job" /><Footer /></>
  return <div className="min-h-screen bg-[#fbfdfb] text-[#17352b]"><Navbar /><main className="mx-auto max-w-3xl px-5 py-12 lg:px-8 lg:py-16"><Link className="inline-flex items-center gap-2 text-sm font-bold text-[#5e7669]" to="/recruiter/jobs"><ArrowLeft size={16} /> Back to jobs</Link><p className="eyebrow mt-10">Recruiter workspace</p><h1 className="mt-3 font-display text-5xl font-semibold">{editing ? 'Edit job' : 'Post a job'}</h1>{error && <div className="mt-6"><ErrorState message={error} /></div>}<form className="mt-8 space-y-5 rounded-2xl border border-[#dbe7de] bg-white p-6" onSubmit={submit}><div className="grid gap-5 sm:grid-cols-2"><Input id="title" name="title" label="Job title" value={form.title} onChange={updateField} required /><Input id="company" name="company" label="Company" value={form.company} onChange={updateField} required /></div><div className="grid gap-5 sm:grid-cols-2"><Input id="location" name="location" label="Location" value={form.location} onChange={updateField} required /><Input id="experience" name="experience" label="Experience" value={form.experience} onChange={updateField} required /></div><label className="block text-sm font-semibold">Description<textarea className="mt-2 min-h-40 w-full rounded-lg border border-[#cbd9d0] px-3.5 py-3 text-sm outline-none focus:border-[#5e9b78]" name="description" value={form.description} onChange={updateField} required /></label><Input id="skills" name="skills" label="Skills, comma separated" value={form.skills} onChange={updateField} required /><div className="grid gap-5 sm:grid-cols-3"><label className="text-sm font-semibold">Job type<select className="mt-2 w-full rounded-lg border border-[#cbd9d0] px-3 py-3 text-sm" name="jobType" value={form.jobType} onChange={updateField}><option value="full-time">Full-time</option><option value="part-time">Part-time</option><option value="contract">Contract</option><option value="internship">Internship</option></select></label><label className="text-sm font-semibold">Work mode<select className="mt-2 w-full rounded-lg border border-[#cbd9d0] px-3 py-3 text-sm" name="workMode" value={form.workMode} onChange={updateField}><option value="on-site">On-site</option><option value="hybrid">Hybrid</option><option value="remote">Remote</option></select></label><label className="text-sm font-semibold">Status<select className="mt-2 w-full rounded-lg border border-[#cbd9d0] px-3 py-3 text-sm" name="status" value={form.status} onChange={updateField}><option value="draft">Draft</option><option value="published">Published</option><option value="closed">Closed</option></select></label></div><div className="grid gap-5 sm:grid-cols-2"><Input id="salary-min" name="salary.min" label="Salary minimum" type="number" value={form.salary.min} onChange={updateField} /><Input id="salary-max" name="salary.max" label="Salary maximum" type="number" value={form.salary.max} onChange={updateField} /></div><Button type="submit" disabled={saving}>{saving ? 'Saving...' : editing ? 'Save changes' : 'Create job'}</Button></form></main><Footer /></div>
}

export default RecruiterJobForm
