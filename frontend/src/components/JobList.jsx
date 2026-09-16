import EmptyState from './EmptyState'
import JobCard from './JobCard'

function JobList({ jobs, featured = false }) {
  if (!jobs.length) return <EmptyState />
  return <div className="grid gap-4 md:grid-cols-2">{jobs.map((job) => <JobCard key={job.id} job={job} featured={featured || job.featured} />)}</div>
}

export default JobList
