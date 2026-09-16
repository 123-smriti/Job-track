import { SearchX } from 'lucide-react'

function EmptyState({ title = 'No roles found', description = 'Try adjusting your search or filters.' }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#cbd9d0] bg-[#f8fbf8] px-6 py-16 text-center">
      <span className="mb-4 rounded-full bg-[#e4f0e7] p-3 text-[#28704d]"><SearchX size={22} /></span>
      <h3 className="font-display text-2xl font-semibold text-[#17352b]">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-[#6a7c73]">{description}</p>
    </div>
  )
}

export default EmptyState
