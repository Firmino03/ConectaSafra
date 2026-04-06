// src/components/ui/EmptyState.tsx
import Link from 'next/link'

interface Props {
  icon: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
}

export function EmptyState({ icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mb-4 text-gray-300">
        {icon}
      </div>
      <h3 className="text-sm font-medium text-gray-700 mb-1">{title}</h3>
      {description && <p className="text-xs text-gray-400 max-w-xs leading-relaxed">{description}</p>}
      {action && (
        <div className="mt-4">
          {action.href ? (
            <Link href={action.href} className="btn-primary text-sm px-5 py-2">
              {action.label}
            </Link>
          ) : (
            <button onClick={action.onClick} className="btn-primary text-sm px-5 py-2">
              {action.label}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
