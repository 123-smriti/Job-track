import { SlidersHorizontal } from 'lucide-react'

function FilterPanel({ filters, onChange }) {
  return (
    <aside className="rounded-2xl border border-[#dbe7de] bg-white p-5">
      <div className="flex items-center justify-between"><h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.12em] text-[#29483c]"><SlidersHorizontal size={16} />Filters</h2><button className="text-xs font-bold text-[#28704d] hover:underline" type="button" onClick={() => onChange({ location: '', experience: '' })}>Clear all</button></div>
      <div className="mt-6 space-y-5">
        <label className="block text-sm font-bold text-[#29483c]">Location<select className="mt-2 w-full rounded-lg border border-[#cbd9d0] bg-white px-3 py-2.5 text-sm font-normal text-[#657a6f] outline-none focus:border-[#5e9b78]" value={filters.location} onChange={(event) => onChange({ location: event.target.value })}><option value="">Any location</option><option value="Remote">Remote</option><option value="New York">New York</option><option value="Chicago">Chicago</option><option value="Austin">Austin</option><option value="Boston">Boston</option></select></label>
        <label className="block text-sm font-bold text-[#29483c]">Experience level<select className="mt-2 w-full rounded-lg border border-[#cbd9d0] bg-white px-3 py-2.5 text-sm font-normal text-[#657a6f] outline-none focus:border-[#5e9b78]" value={filters.experience} onChange={(event) => onChange({ experience: event.target.value })}><option value="">Any experience</option><option value="Entry level">Entry level</option><option value="Mid level">Mid level</option><option value="Senior level">Senior level</option><option value="Staff level">Staff level</option></select></label>
        <label className="block text-sm font-bold text-[#29483c]">Job type<select className="mt-2 w-full rounded-lg border border-[#cbd9d0] bg-white px-3 py-2.5 text-sm font-normal text-[#657a6f] outline-none focus:border-[#5e9b78]" value={filters.jobType} onChange={(event) => onChange({ jobType: event.target.value })}><option value="">Any job type</option><option value="full-time">Full-time</option><option value="part-time">Part-time</option><option value="contract">Contract</option><option value="internship">Internship</option></select></label>
        <label className="block text-sm font-bold text-[#29483c]">Work mode<select className="mt-2 w-full rounded-lg border border-[#cbd9d0] bg-white px-3 py-2.5 text-sm font-normal text-[#657a6f] outline-none focus:border-[#5e9b78]" value={filters.workMode} onChange={(event) => onChange({ workMode: event.target.value })}><option value="">Any work mode</option><option value="remote">Remote</option><option value="hybrid">Hybrid</option><option value="on-site">On-site</option></select></label>
      </div>
    </aside>
  )
}

export default FilterPanel
