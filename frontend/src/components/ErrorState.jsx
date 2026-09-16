import { RefreshCw, TriangleAlert } from 'lucide-react'

function ErrorState({ message = 'Something went wrong while loading this page.', title = 'Something went wrong', onRetry }) {
  return <div className="flex flex-col items-center justify-center rounded-2xl border border-[#f0d6ca] bg-[#fff8f5] px-6 py-16 text-center"><span className="mb-4 rounded-full bg-[#ffe8df] p-3 text-[#b45b3d]"><TriangleAlert size={22} /></span><h3 className="font-display text-2xl font-semibold text-[#17352b]">{title}</h3><p className="mt-2 max-w-md text-sm leading-6 text-[#8a6b5e]">{message}</p>{onRetry && <button className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#17352b] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#245544]" type="button" onClick={onRetry}><RefreshCw size={16} /> Try again</button>}</div>
}

export default ErrorState
