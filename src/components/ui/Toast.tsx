'use client'
// src/components/ui/Toast.tsx
import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
}

interface ToastContextValue {
  toasts: Toast[]
  toast: (type: ToastType, title: string, message?: string) => void
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  warning: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, type, title, message }])
    setTimeout(() => dismiss(id), 4500)
  }, [dismiss])

  const success = useCallback((title: string, message?: string) => toast('success', title, message), [toast])
  const error   = useCallback((title: string, message?: string) => toast('error', title, message), [toast])
  const warning = useCallback((title: string, message?: string) => toast('warning', title, message), [toast])
  const info    = useCallback((title: string, message?: string) => toast('info', title, message), [toast])

  return (
    <ToastContext.Provider value={{ toasts, toast, success, error, warning, info, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-4 h-4" />,
  error:   <XCircle className="w-4 h-4" />,
  warning: <AlertCircle className="w-4 h-4" />,
  info:    <Info className="w-4 h-4" />,
}

const styles: Record<ToastType, string> = {
  success: 'bg-white border-green-200 text-green-800',
  error:   'bg-white border-red-200 text-red-800',
  warning: 'bg-white border-amber-200 text-amber-800',
  info:    'bg-white border-blue-200 text-blue-800',
}

const iconStyles: Record<ToastType, string> = {
  success: 'text-green-600 bg-green-50',
  error:   'text-red-600 bg-red-50',
  warning: 'text-amber-600 bg-amber-50',
  info:    'text-blue-600 bg-blue-50',
}

function ToastContainer({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: string) => void }) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 max-w-sm w-full">
      {toasts.map(t => (
        <div
          key={t.id}
          className={cn(
            'flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg',
            'animate-slide-in',
            styles[t.type]
          )}
        >
          <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0', iconStyles[t.type])}>
            {icons[t.type]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">{t.title}</p>
            {t.message && <p className="text-xs text-gray-500 mt-0.5">{t.message}</p>}
          </div>
          <button
            onClick={() => dismiss(t.id)}
            className="p-0.5 hover:bg-gray-100 rounded-md text-gray-400 hover:text-gray-600 flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  )
}
