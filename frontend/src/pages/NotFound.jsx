import { ArrowLeft, Compass } from 'lucide-react'
import Button from '../components/Button'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

function NotFound() {
  return <div className="min-h-screen bg-[#fbfdfb] text-[#17352b]"><Navbar /><main className="mx-auto flex max-w-2xl flex-col items-center px-5 py-24 text-center lg:px-8"><span className="rounded-full bg-[#e4f0e7] p-4 text-[#28704d]"><Compass size={26} /></span><p className="eyebrow mt-6">404 error</p><h1 className="mt-3 font-display text-6xl font-semibold">Page not found.</h1><p className="mt-5 max-w-md text-sm leading-6 text-[#70847a]">The page you are looking for may have moved or no longer exists.</p><Button className="mt-8" to="/"><ArrowLeft size={16} /> Return home</Button></main><Footer /></div>
}

export default NotFound
