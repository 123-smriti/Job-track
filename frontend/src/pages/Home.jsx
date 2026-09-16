import { ArrowRight, BriefcaseBusiness, Globe2, Sparkles, TrendingUp, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Footer from '../components/Footer'
import JobList from '../components/JobList'
import Navbar from '../components/Navbar'
import SearchBar from '../components/SearchBar'
import { categories, jobs } from '../data/jobs'

const stats = [
  { value: '24k+', label: 'Open opportunities', icon: BriefcaseBusiness },
  { value: '8.6k', label: 'Companies hiring', icon: TrendingUp },
  { value: '42', label: 'Countries represented', icon: Globe2 },
]

function Home() {
  const navigate = useNavigate()
  const featuredJobs = jobs.filter((job) => job.featured)

  function searchJobs({ query, location }) {
    const params = new URLSearchParams()
    if (query) params.set('search', query)
    if (location) params.set('location', location)
    navigate(`/jobs?${params.toString()}`)
  }

  return (
    <div className="bg-[#fbfdfb] text-[#17352b]">
      <Navbar />
      <main>
        <section className="relative overflow-hidden bg-[#edf6ee]">
          <div className="pointer-events-none absolute -right-32 -top-36 h-[30rem] w-[30rem] rounded-full border-[4rem] border-[#dceede] opacity-80" />
          <div className="pointer-events-none absolute bottom-[-12rem] left-[-8rem] h-[26rem] w-[26rem] rounded-full bg-[#dceede]/60" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 md:py-28 lg:grid-cols-[1fr_0.72fr] lg:px-8 lg:py-32">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#bdd9c4] bg-white/70 px-3 py-1.5 text-xs font-black uppercase tracking-[0.13em] text-[#28704d]"><Sparkles size={14} /> A better way forward</div>
              <h1 className="max-w-3xl font-display text-5xl font-semibold leading-[0.96] tracking-[-0.035em] text-[#17352b] sm:text-6xl lg:text-8xl">Find work that <span className="text-[#28704d]">moves you.</span></h1>
              <p className="mt-7 max-w-xl text-base leading-7 text-[#5c7568] sm:text-lg">Discover thoughtful opportunities at companies building what comes next. Search less. Find more of the work that fits.</p>
              <div className="mt-9 max-w-3xl"><SearchBar onSearch={searchJobs} /></div>
              <p className="mt-4 text-xs font-semibold text-[#779186]">Popular: Product design · Engineering · Remote work</p>
            </div>
            <div className="relative hidden min-h-[26rem] lg:block">
              <div className="absolute right-4 top-8 w-72 rotate-3 rounded-2xl border border-[#c7dfcd] bg-white p-5 shadow-[0_22px_60px_rgba(36,91,61,0.13)]"><div className="flex items-center justify-between"><span className="text-xs font-black uppercase tracking-[0.12em] text-[#28704d]">New opportunity</span><span className="h-2 w-2 rounded-full bg-[#e17b4f]" /></div><p className="mt-6 font-display text-2xl font-semibold">Senior Product Designer</p><p className="mt-2 text-sm text-[#72877b]">Northstar Labs · New York</p><div className="mt-8 flex gap-2"><span className="rounded bg-[#edf6ee] px-2 py-1 text-[10px] font-bold text-[#28704d]">Design systems</span><span className="rounded bg-[#edf6ee] px-2 py-1 text-[10px] font-bold text-[#28704d]">Figma</span></div></div>
              <div className="absolute bottom-10 left-0 w-64 -rotate-6 rounded-2xl border border-[#d8d1c5] bg-[#fff9ef] p-5 shadow-[0_22px_60px_rgba(94,75,45,0.1)]"><p className="text-xs font-black uppercase tracking-[0.12em] text-[#ae643f]">Your next chapter</p><div className="mt-6 flex items-end gap-2"><div className="h-12 w-12 rounded-full bg-[#f4d1bd]" /><div className="h-20 w-20 rounded-full bg-[#e9b08f]" /><div className="h-28 w-28 rounded-full bg-[#d8e6cf]" /></div><p className="mt-5 text-sm font-semibold text-[#6d6c57]">Good work starts with a good fit.</p></div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="eyebrow">Curated for you</p><h2 className="section-title">Featured roles</h2></div><Button variant="ghost" to="/jobs">View all jobs <ArrowRight size={17} /></Button></div>
          <div className="mt-9"><JobList jobs={featuredJobs} featured /></div>
        </section>

        <section className="border-y border-[#e1eae3] bg-[#f5f9f5]">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24"><p className="eyebrow">Explore by focus</p><div className="mt-3 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><h2 className="section-title max-w-xl">Find your next place to make an impact.</h2><p className="max-w-xs text-sm leading-6 text-[#70847a]">Browse opportunities across the teams shaping our shared future.</p></div><div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{categories.map((category) => <button className="group flex items-center justify-between rounded-xl border border-[#d9e6db] bg-white p-5 text-left transition hover:-translate-y-1 hover:border-[#9fbea9] hover:shadow-lg" key={category.name} type="button" onClick={() => navigate(`/jobs?search=${category.name}`)}><span><span className="grid h-10 w-10 place-items-center rounded-lg bg-[#e4f0e7] text-lg font-bold text-[#28704d]">{category.icon}</span><span className="mt-5 block font-display text-xl font-semibold text-[#17352b]">{category.name}</span><span className="mt-1 block text-xs font-semibold text-[#82958a]">{category.count}</span></span><ArrowRight className="text-[#8ca599] transition group-hover:translate-x-1 group-hover:text-[#28704d]" size={19} /></button>)}</div></div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:px-8 lg:py-28"><div><p className="eyebrow">A bigger picture</p><h2 className="section-title">The numbers behind the momentum.</h2><p className="mt-6 max-w-md text-base leading-7 text-[#657a6f]">Every role is a chance to build something useful, learn something new, and work alongside people who care about the outcome.</p></div><div className="grid gap-3 sm:grid-cols-3">{stats.map(({ value, label, icon: Icon }) => <div className="rounded-2xl bg-[#17352b] p-5 text-[#e7f3e9] sm:p-6" key={label}><Icon className="text-[#9bcaa8]" size={21} /><p className="mt-12 font-display text-4xl font-semibold">{value}</p><p className="mt-2 text-sm leading-5 text-[#a9c2b0]">{label}</p></div>)}</div></section>

        <section className="mx-5 mb-20 rounded-2xl bg-[#eaf3ec] px-6 py-12 text-center sm:px-12 lg:mx-auto lg:max-w-7xl"><Users className="mx-auto text-[#28704d]" size={23} /><h2 className="mt-4 font-display text-3xl font-semibold text-[#17352b]">Your next chapter is out there.</h2><p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#657a6f]">Create a profile and let the right opportunities find their way to you.</p><Button className="mt-7" to="/register">Create your profile <ArrowRight size={16} /></Button></section>
      </main>
      <Footer />
    </div>
  )
}

export default Home
