import { ArrowLeft, ShieldAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

function Unauthorized() {
  return <div className="min-h-screen bg-[#fbfdfb] text-[#17352b]"><Navbar /><main className="mx-auto flex max-w-2xl flex-col items-center px-5 py-24 text-center lg:px-8"><span className="rounded-full bg-[#fff0eb] p-4 text-[#b45b3d]"><ShieldAlert size={26} /></span><p className="eyebrow mt-6 text-[#b45b3d]">Access restricted</p><h1 className="mt-3 font-display text-6xl font-semibold">You do not have access.</h1><p className="mt-5 max-w-md text-sm leading-6 text-[#70847a]">Your account does not have the role required to view this page.</p><div className="mt-8 flex gap-2"><Button variant="secondary" to="/"><ArrowLeft size={16} /> Return home</Button><Link className="inline-flex items-center rounded-lg bg-[#17352b] px-4 py-2.5 text-sm font-bold text-white" to="/login">Switch account</Link></div></main><Footer /></div>
}

export default Unauthorized
