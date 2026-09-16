import { LogOut, Save, UserRound } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import useAuth from '../context/useAuth'
import { updateProfile } from '../services/candidateApi'

function Account() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState(user.name)
  const [headline, setHeadline] = useState(user.profile?.headline || '')
  const [location, setLocation] = useState(user.profile?.location || '')
  const [message, setMessage] = useState('')

  async function signOut() {
    await logout()
    navigate('/')
  }

  async function saveProfile(event) {
    event.preventDefault()
    try {
      await updateProfile({ name, profile: { ...user.profile, headline, location } })
      setMessage('Profile updated successfully.')
    } catch (error) {
      setMessage(error.message)
    }
  }

  return <div className="min-h-screen bg-[#fbfdfb] text-[#17352b]"><Navbar /><main className="mx-auto max-w-4xl px-5 py-16 lg:px-8 lg:py-24"><p className="eyebrow">Authenticated area</p><div className="mt-3 flex flex-col justify-between gap-6 border-b border-[#dbe7de] pb-8 sm:flex-row sm:items-end"><div><h1 className="font-display text-5xl font-semibold tracking-[-0.035em]">Hello, {user.name}.</h1><p className="mt-3 text-sm text-[#70847a]">Keep your candidate profile current.</p></div><Button variant="secondary" onClick={signOut}><LogOut size={16} /> Sign out</Button></div><section className="mt-8 rounded-2xl border border-[#dbe7de] bg-white p-6"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#e4f0e7] text-[#28704d]"><UserRound size={18} /></span><div><p className="text-sm font-bold">{user.email}</p><p className="text-xs capitalize text-[#82958a]">{user.role} account</p></div></div><form className="mt-7 grid gap-5 sm:grid-cols-2" onSubmit={saveProfile}><label className="text-sm font-semibold">Name<input className="mt-2 w-full rounded-lg border border-[#cbd9d0] px-3 py-2.5" value={name} onChange={(event) => setName(event.target.value)} /></label><label className="text-sm font-semibold">Location<input className="mt-2 w-full rounded-lg border border-[#cbd9d0] px-3 py-2.5" value={location} onChange={(event) => setLocation(event.target.value)} /></label><label className="text-sm font-semibold sm:col-span-2">Headline<input className="mt-2 w-full rounded-lg border border-[#cbd9d0] px-3 py-2.5" value={headline} onChange={(event) => setHeadline(event.target.value)} /></label><div className="flex items-center gap-4 sm:col-span-2"><Button type="submit"><Save size={16} /> Save profile</Button>{message && <span className="text-sm font-semibold text-[#28704d]">{message}</span>}</div></form></section></main><Footer /></div>
}

export default Account
