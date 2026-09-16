import { ArrowUpRight, Globe2, Share2 } from 'lucide-react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="border-t border-[#dbe7de] bg-[#17352b] text-[#d6e8da]">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <Link className="flex items-center gap-2.5 text-white" to="/">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#dff0e3] text-sm font-black text-[#17352b]">JT</span>
            <span className="font-display text-xl font-semibold">JobTrack</span>
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-6 text-[#a9c2b0]">A more considered way to find work that fits your ambition.</p>
          <div className="mt-7 flex gap-2">
            <a className="rounded-full border border-[#406253] p-2.5 text-[#b7d4be] transition hover:border-[#dff0e3] hover:text-white" href="https://www.linkedin.com" aria-label="LinkedIn"><Share2 size={16} /></a>
            <a className="rounded-full border border-[#406253] p-2.5 text-[#b7d4be] transition hover:border-[#dff0e3] hover:text-white" href="https://twitter.com" aria-label="Social profile"><Globe2 size={16} /></a>
          </div>
        </div>
        <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8fb19a]">Candidates</p><div className="mt-5 space-y-3 text-sm"><Link className="block hover:text-white" to="/jobs">Browse jobs</Link><Link className="block hover:text-white" to="/register">Create profile</Link><Link className="block hover:text-white" to="/login">Sign in</Link></div></div>
        <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8fb19a]">Company</p><div className="mt-5 space-y-3 text-sm"><a className="flex items-center gap-1 hover:text-white" href="mailto:hello@jobtrack.example">About us <ArrowUpRight size={14} /></a><a className="flex items-center gap-1 hover:text-white" href="mailto:hello@jobtrack.example">Contact <ArrowUpRight size={14} /></a><a className="flex items-center gap-1 hover:text-white" href="mailto:hello@jobtrack.example">Careers <ArrowUpRight size={14} /></a></div></div>
        <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8fb19a]">Resources</p><div className="mt-5 space-y-3 text-sm"><a className="block hover:text-white" href="mailto:hello@jobtrack.example">Hiring guide</a><a className="block hover:text-white" href="mailto:hello@jobtrack.example">Career advice</a><a className="block hover:text-white" href="mailto:hello@jobtrack.example">Support center</a></div></div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-col gap-3 border-t border-[#315242] px-5 py-5 text-xs text-[#8fb19a] sm:flex-row sm:items-center sm:justify-between lg:px-8"><span>© 2025 JobTrack, Inc. All rights reserved.</span><span>Made for meaningful work.</span></div>
    </footer>
  )
}

export default Footer
