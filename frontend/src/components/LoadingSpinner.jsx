function LoadingSpinner({ label = 'Loading' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-12 text-sm font-semibold text-[#597267]" role="status">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#cfe0d4] border-t-[#28704d]" />
      {label}
    </div>
  )
}

export default LoadingSpinner
