import { Bookmark, Clock3, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

function JobCard({ job, featured = false, onRemove }) {
  return (
    <article className={`group relative rounded-2xl border bg-white p-5 transition hover:-translate-y-1 hover:border-[#9fbea9] hover:shadow-[0_16px_34px_rgba(23,53,43,0.09)] ${featured ? 'border-[#cbded0]' : 'border-[#e1eae3]'}`}>
      {featured && <span className="absolute right-5 top-5 rounded-full bg-[#e4f0e7] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#28704d]">Featured</span>}
      <div className="flex items-start justify-between gap-3">
        <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-xs font-black ${job.logoClass}`}>{job.logo}</div>
        <button className="rounded-full p-2 text-[#8aa095] transition hover:bg-[#edf5ef] hover:text-[#28704d]" type="button" aria-label={`${onRemove ? 'Remove' : 'Save'} ${job.title}`} onClick={onRemove}>{onRemove ? '×' : <Bookmark size={18} />}</button>
      </div>
      <Link className="mt-5 block" to={`/jobs/${job.id}`}>
        <h3 className="font-display text-[1.3rem] font-semibold leading-tight text-[#17352b] group-hover:text-[#28704d]">{job.title}</h3>
        <p className="mt-2 text-sm font-semibold text-[#657a6f]">{job.company}</p>
      </Link>
      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-[#74877c]"><span className="flex items-center gap-1.5"><MapPin size={14} />{job.location}</span><span className="flex items-center gap-1.5"><Clock3 size={14} />{job.type}</span></div>
      <div className="mt-5 flex items-center justify-between border-t border-[#edf2ed] pt-4"><span className="text-sm font-bold text-[#28704d]">{job.salary}</span><span className="text-xs text-[#91a097]">{job.posted}</span></div>
    </article>
  )
}

export default JobCard
