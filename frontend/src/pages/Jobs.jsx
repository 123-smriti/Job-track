import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ErrorState from '../components/ErrorState'
import FilterPanel from '../components/FilterPanel'
import Footer from '../components/Footer'
import JobList from '../components/JobList'
import LoadingSpinner from '../components/LoadingSpinner'
import Navbar from '../components/Navbar'
import SearchBar from '../components/SearchBar'
import { getJobs } from '../services/jobsApi'

function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState({ location: searchParams.get('location') || '', experience: searchParams.get('experience') || '', jobType: searchParams.get('jobType') || '', workMode: searchParams.get('workMode') || '' })
  const [jobs, setJobs] = useState([])
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [mobileFilters, setMobileFilters] = useState(false)
  const query = searchParams.get('search') || ''

  async function loadJobs() {
    setLoading(true)
    setError('')
    try {
      const result = await getJobs(Object.fromEntries(searchParams.entries()))
      setJobs(result.data)
      setPagination(result.pagination)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadJobs() }, [searchParams.toString()])

  function updateUrl(changes) {
    const params = new URLSearchParams(searchParams)
    Object.entries(changes).forEach(([key, value]) => value ? params.set(key, value) : params.delete(key))
    params.delete('page')
    setFilters((current) => ({ ...current, ...changes }))
    setSearchParams(params)
  }

  function searchJobs({ query: nextQuery, location: nextLocation }) {
    const params = new URLSearchParams(searchParams)
    if (nextQuery) params.set('search', nextQuery)
    else params.delete('search')
    if (nextLocation) params.set('location', nextLocation)
    else params.delete('location')
    params.delete('page')
    setFilters((current) => ({ ...current, location: nextLocation }))
    setSearchParams(params)
  }

  function changePage(page) {
    const params = new URLSearchParams(searchParams)
    params.set('page', page)
    setSearchParams(params)
  }

  const previousPage = pagination.page > 1 ? pagination.page - 1 : null
  const nextPage = pagination.page < pagination.totalPages ? pagination.page + 1 : null

  return <div className="bg-[#fbfdfb] text-[#17352b]"><Navbar /><main><section className="border-b border-[#dfeae1] bg-[#edf6ee]"><div className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20"><p className="eyebrow">The job board</p><h1 className="mt-3 font-display text-5xl font-semibold tracking-[-0.035em] sm:text-6xl">Make your next move.</h1><p className="mt-5 max-w-lg text-base leading-7 text-[#5e7669]">Search open roles from companies doing work worth showing up for.</p><div className="mt-8 max-w-3xl"><SearchBar initialQuery={query} initialLocation={searchParams.get('location') || ''} onSearch={searchJobs} compact /></div></div></section><section className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14"><div className="mb-6 flex items-center justify-between"><p className="text-sm font-semibold text-[#82958a]">Showing <span className="text-[#17352b]">{pagination.total} roles</span></p><button className="inline-flex items-center gap-2 rounded-lg border border-[#cbd9d0] bg-white px-3 py-2 text-sm font-bold text-[#29483c] lg:hidden" type="button" onClick={() => setMobileFilters(!mobileFilters)}><SlidersHorizontal size={16} /> Filters</button></div><div className="grid gap-8 lg:grid-cols-[230px_1fr]"><div className={`${mobileFilters ? 'block' : 'hidden'} lg:block`}><FilterPanel filters={filters} onChange={updateUrl} /></div><div>{loading ? <LoadingSpinner label="Loading open roles" /> : error ? <ErrorState message={error} onRetry={loadJobs} /> : <><JobList jobs={jobs} /><div className="mt-9 flex items-center justify-center gap-2"><button className="grid h-9 w-9 place-items-center rounded-lg border border-[#dbe7de] text-[#7b9184] disabled:opacity-50" type="button" disabled={!previousPage} onClick={() => changePage(previousPage)}><ChevronLeft size={16} /></button>{pagination.totalPages > 0 && Array.from({ length: Math.min(pagination.totalPages, 3) }, (_, index) => index + 1).map((page) => <button className={`grid h-9 w-9 place-items-center rounded-lg text-sm font-bold ${page === pagination.page ? 'bg-[#17352b] text-white' : 'border border-[#dbe7de] text-[#536c60] hover:bg-[#edf6ee]'}`} key={page} type="button" onClick={() => changePage(page)}>{page}</button>)}<button className="grid h-9 w-9 place-items-center rounded-lg border border-[#dbe7de] text-[#536c60] disabled:opacity-50" type="button" disabled={!nextPage} onClick={() => changePage(nextPage)}><ChevronRight size={16} /></button></div></>}</div></div></section></main><Footer /></div>
}

export default Jobs
