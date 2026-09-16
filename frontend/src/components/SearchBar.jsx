import { MapPin, Search } from 'lucide-react'
import { useState } from 'react'
import Button from './Button'

function SearchBar({ initialQuery = '', initialLocation = '', onSearch, compact = false }) {
  const [query, setQuery] = useState(initialQuery)
  const [location, setLocation] = useState(initialLocation)

  function submit(event) {
    event.preventDefault()
    onSearch?.({ query, location })
  }

  return (
    <form className={`grid gap-2 rounded-xl border border-[#cbd9d0] bg-white p-2 shadow-[0_12px_30px_rgba(23,53,43,0.07)] ${compact ? 'md:grid-cols-[1.4fr_1fr_auto]' : 'md:grid-cols-[1.4fr_1fr_auto]'}`} onSubmit={submit} role="search">
      <label className="flex min-w-0 items-center gap-3 rounded-lg px-3 py-2 focus-within:bg-[#f6faf6]">
        <Search className="shrink-0 text-[#719080]" size={19} />
        <span className="sr-only">Job title, skill, or keyword</span>
        <input className="min-w-0 flex-1 bg-transparent text-sm text-[#17352b] outline-none placeholder:text-[#8ca198]" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Job title, skill, or keyword" />
      </label>
      <label className="flex min-w-0 items-center gap-3 rounded-lg border-t border-[#edf2ed] px-3 py-2 md:border-l md:border-t-0 md:pl-5">
        <MapPin className="shrink-0 text-[#719080]" size={19} />
        <span className="sr-only">Location</span>
        <input className="min-w-0 flex-1 bg-transparent text-sm text-[#17352b] outline-none placeholder:text-[#8ca198]" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="City, state, or remote" />
      </label>
      <Button className="w-full md:w-auto" type="submit">Search jobs</Button>
    </form>
  )
}

export default SearchBar
