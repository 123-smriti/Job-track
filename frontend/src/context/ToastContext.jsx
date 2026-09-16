import { useEffect, useState } from 'react'
import { CheckCircle2, X } from 'lucide-react'
import ToastContext from './toast-context'

function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(timer)
  }, [toast])

  function showToast(message, type = 'success') {
    setToast({ message, type })
  }

  const toastClasses = toast?.type === 'error' ? 'border-[#f0d6ca] bg-[#fff8f5] text-[#8a4c3b]' : 'border-[#cbded0] bg-white text-[#17352b]'
  return <ToastContext.Provider value={{ showToast }}><>{children}</>{toast && <div className={`fixed bottom-5 right-5 z-50 flex max-w-sm items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold shadow-[0_18px_45px_rgba(23,53,43,0.16)] ${toastClasses}`} role="status"><CheckCircle2 className="shrink-0 text-[#28704d]" size={18} />{toast.message}<button className="ml-2 rounded p-1 text-[#82958a] hover:bg-[#edf6ee]" type="button" aria-label="Dismiss notification" onClick={() => setToast(null)}><X size={16} /></button></div>}</ToastContext.Provider>
}

export { ToastProvider }
