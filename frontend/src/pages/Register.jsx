import { ArrowRight, Check } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Input from '../components/Input'
import useAuth from '../context/useAuth'
import useToast from '../context/useToast'

function Register() {
  const { register } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', role: 'candidate' })
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
      await register({ name: `${form.firstName} ${form.lastName}`.trim(), email: form.email, password: form.password, role: form.role })
      showToast('Your JobTrack account is ready.')
      navigate('/account', { replace: true })
    } catch (requestError) {
      setError(requestError.message)
      showToast(requestError.message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return <div className="grid min-h-screen bg-[#edf6ee] lg:grid-cols-[0.9fr_1.1fr]"><div className="hidden flex-col justify-between bg-[#17352b] p-10 text-white lg:flex lg:p-14"><Link className="flex items-center gap-2.5" to="/"><span className="grid h-9 w-9 place-items-center rounded-lg bg-[#dff0e3] text-sm font-black text-[#17352b]">JT</span><span className="font-display text-xl font-semibold">JobTrack</span></Link><div><p className="eyebrow text-[#9bcaa8]">Start with intention</p><h1 className="mt-4 max-w-md font-display text-6xl font-semibold leading-[0.98]">Make room for what is next.</h1><div className="mt-8 space-y-4 text-sm text-[#b7d4be]">{['Save roles that spark something.', 'Build a profile worth finding.', 'Keep every opportunity in view.'].map((item) => <p className="flex items-center gap-3" key={item}><span className="grid h-5 w-5 place-items-center rounded-full bg-[#2f6c4c] text-[#dff0e3]"><Check size={13} /></span>{item}</p>)}</div></div><p className="text-xs text-[#8fb19a]">A more considered way to find work.</p></div><main className="flex items-center justify-center px-5 py-12"><div className="w-full max-w-md"><Link className="flex items-center gap-2.5 text-[#17352b] lg:hidden" to="/"><span className="grid h-9 w-9 place-items-center rounded-lg bg-[#17352b] text-sm font-black text-[#dff0e3]">JT</span><span className="font-display text-xl font-semibold">JobTrack</span></Link><div className="mt-14 rounded-2xl border border-[#dbe7de] bg-white p-6 shadow-[0_18px_50px_rgba(23,53,43,0.07)] sm:p-9 lg:mt-0"><div className="mb-8"><p className="eyebrow">Create your profile</p><h2 className="mt-3 font-display text-3xl font-semibold">Start your search</h2><p className="mt-2 text-sm text-[#70847a]">It takes less than a minute to get started.</p></div>{error && <p className="mb-5 rounded-lg bg-[#fff0eb] px-3 py-2.5 text-sm font-semibold text-[#a34d34]" role="alert">{error}</p>}<form className="space-y-5" onSubmit={submit}><div className="grid gap-5 sm:grid-cols-2"><Input id="first-name" name="firstName" label="First name" placeholder="Alex" value={form.firstName} onChange={updateField} required /><Input id="last-name" name="lastName" label="Last name" placeholder="Morgan" value={form.lastName} onChange={updateField} required /></div><Input id="register-email" name="email" label="Email address" type="email" placeholder="you@example.com" value={form.email} onChange={updateField} required /><Input id="register-password" name="password" label="Create password" type="password" placeholder="At least 8 characters" value={form.password} onChange={updateField} minLength="8" required /><label className="block text-sm font-semibold text-[#29483c]" htmlFor="role">I am joining as<select id="role" name="role" className="mt-2 w-full rounded-lg border border-[#cbd9d0] bg-white px-3.5 py-3 text-sm font-normal text-[#17352b] outline-none focus:border-[#5e9b78] focus:ring-4 focus:ring-[#dcefe2]" value={form.role} onChange={updateField}><option value="candidate">Candidate</option><option value="recruiter">Recruiter</option></select></label><label className="flex gap-2 text-xs leading-5 text-[#70847a]"><input className="mt-1 accent-[#28704d]" type="checkbox" required /> I agree to the <a className="font-bold text-[#28704d]" href="mailto:hello@jobtrack.example">terms and privacy policy</a>.</label><Button className="w-full" type="submit" disabled={submitting}>{submitting ? 'Creating account...' : 'Create account'} {!submitting && <ArrowRight size={16} />}</Button></form><p className="mt-7 text-center text-sm text-[#70847a]">Already have an account? <Link className="font-bold text-[#28704d] hover:underline" to="/login">Sign in</Link></p></div></div></main></div>
}

export default Register