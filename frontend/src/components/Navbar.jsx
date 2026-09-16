import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import Button from './Button'
import useAuth from '../context/useAuth'

const links = [
  { label: 'Find jobs', to: '/jobs' },
  { label: 'For employers', to: '/register' },
]

function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const navClass = ({ isActive }) => `text-sm font-semibold transition ${isActive ? 'text-[#17352b]' : 'text-[#668077] hover:text-[#17352b]'}`
  const dashboardPath = user?.role === 'admin' ? '/admin/dashboard' : user?.role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard'

  async function signOut() {
    await logout()
    setOpen(false)
  }

  return (
    <header className="border-b border-[#e1eae3] bg-[#fbfdfb]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <NavLink className="flex items-center gap-2.5 text-[#17352b]" to="/" onClick={() => setOpen(false)}>
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#17352b] text-sm font-black text-[#dff0e3]">JT</span>
          <span className="font-display text-xl font-semibold tracking-tight">JobTrack</span>
        </NavLink>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {links.map((link) => <NavLink className={navClass} key={link.to} to={link.to}>{link.label}</NavLink>)}
          {user ? <><NavLink className={navClass} to={dashboardPath}>Dashboard</NavLink><button className="text-sm font-semibold text-[#668077] hover:text-[#17352b]" type="button" onClick={signOut}>Sign out</button></> : <><NavLink className={navClass} to="/login">Sign in</NavLink><Button className="px-4 py-2" to="/register">Create account</Button></>}
        </nav>

        <button className="rounded-lg p-2 text-[#17352b] md:hidden" type="button" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>
          {open ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-[#e1eae3] px-5 py-4 md:hidden" aria-label="Mobile navigation">
          <div className="flex flex-col gap-1">
            {links.map((link) => <NavLink className="rounded-lg px-3 py-3 text-sm font-semibold text-[#536c60] hover:bg-[#f0f6f1]" key={link.to} to={link.to} onClick={() => setOpen(false)}>{link.label}</NavLink>)}
            {user ? <><NavLink className="rounded-lg px-3 py-3 text-sm font-semibold text-[#536c60] hover:bg-[#f0f6f1]" to={dashboardPath} onClick={() => setOpen(false)}>Dashboard</NavLink><button className="rounded-lg px-3 py-3 text-left text-sm font-semibold text-[#536c60] hover:bg-[#f0f6f1]" type="button" onClick={signOut}>Sign out</button></> : <><NavLink className="rounded-lg px-3 py-3 text-sm font-semibold text-[#536c60] hover:bg-[#f0f6f1]" to="/login" onClick={() => setOpen(false)}>Sign in</NavLink><Button className="mt-2" to="/register" onClick={() => setOpen(false)}>Create account</Button></>}
          </div>
        </nav>
      )}
    </header>
  )
}

export default Navbar
