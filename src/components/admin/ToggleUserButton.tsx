'use client'
// src/components/admin/ToggleUserButton.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export function ToggleUserButton({ userId, active }: { userId: string; active: boolean }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function toggle() {
    setLoading(true)
    await fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !active }),
    })
    router.refresh()
    setLoading(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors
        ${active
          ? 'border-red-100 text-red-700 bg-red-50 hover:bg-red-100'
          : 'border-green-100 text-green-700 bg-green-50 hover:bg-green-100'
        }`}
    >
      {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : active ? 'Desativar' : 'Ativar'}
    </button>
  )
}
