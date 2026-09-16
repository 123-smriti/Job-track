import { ArrowRight, LockKeyhole } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Input from '../components/Input'
import useAuth from '../context/useAuth'
import useToast from '../context/useToast'

function Login() {
  const { login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function submit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await login(form)
      showToast('Welcome back to JobTrack.')
      navigate(location.state?.from?.pathname || '/account', { replace: true })
    } catch (requestError) {
      setError(requestError.message)
      showToast(requestError.message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return <div className="grid min-h-screen bg-[#edf6ee] lg:grid-cols-[0.9fr_1.1fr]"><div className="hidden flex-col justify-between bg-[#17352b] p-10 text-white lg:flex lg:p-14"><Link className="flex items-center gap-2.5" to="/"><span className="grid h-9 w-9 place-items-center rounded-lg bg-[#dff0e3] text-sm font-black text-[#17352b]">JT</span><span className="font-display text-xl font-semibold">JobTrack</span></Link><div><p className="eyebrow text-[#9bcaa8]">Welcome back</p><h1 className="mt-4 max-w-md font-display text-6xl font-semibold leading-[0.98]">Good work is waiting.</h1><p className="mt-6 max-w-sm text-sm leading-6 text-[#a9c2b0]">Pick up where you left off and keep moving toward work that fits.</p></div><p className="text-xs text-[#8fb19a]">A more considered way to find work.</p></div><main className="flex items-center justify-center px-5 py-12"><div className="w-full max-w-md"><Link className="flex items-center gap-2.5 text-[#17352b] lg:hidden" to="/"><span className="grid h-9 w-9 place-items-center rounded-lg bg-[#17352b] text-sm font-black text-[#dff0e3]">JT</span><span className="font-display text-xl font-semibold">JobTrack</span></Link><div className="mt-14 rounded-2xl border border-[#dbe7de] bg-white p-6 shadow-[0_18px_50px_rgba(23,53,43,0.07)] sm:p-9 lg:mt-0"><div className="mb-8"><span className="mb-5 grid h-10 w-10 place-items-center rounded-lg bg-[#e4f0e7] text-[#28704d]"><LockKeyhole size={19} /></span><h2 className="font-display text-3xl font-semibold">Welcome back</h2><p className="mt-2 text-sm text-[#70847a]">Sign in to manage your job search.</p></div>{error && <p className="mb-5 rounded-lg bg-[#fff0eb] px-3 py-2.5 text-sm font-semibold text-[#a34d34]" role="alert">{error}</p>}<form className="space-y-5" onSubmit={submit}><Input id="email" name="email" label="Email address" type="email" placeholder="you@example.com" value={form.email} onChange={updateField} required /><Input id="password" name="password" label="Password" type="password" placeholder="Enter your password" value={form.password} onChange={updateField} required /><div className="flex items-center justify-between text-xs"><label className="flex items-center gap-2 text-[#70847a]"><input className="accent-[#28704d]" type="checkbox" /> Remember me</label><a className="font-bold text-[#28704d] hover:underline" href="mailto:support@jobtrack.example">Forgot password?</a></div><Button className="w-full" type="submit" disabled={submitting}>{submitting ? 'Signing in...' : 'Sign in'} {!submitting && <ArrowRight size={16} />}</Button></form><p className="mt-7 text-center text-sm text-[#70847a]">New to JobTrack? <Link className="font-bold text-[#28704d] hover:underline" to="/register">Create an account</Link></p></div></div></main></div>
}

export default Login