// src/app/not-found.tsx
import Link from 'next/link'
import { Sprout } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F7FAF3] flex items-center justify-center p-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-50 border border-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Sprout className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="font-display text-4xl font-semibold text-gray-900 mb-3">404</h1>
        <p className="text-gray-500 mb-2">Página não encontrada</p>
        <p className="text-sm text-gray-400 mb-8">Esta página não existe ou foi movida.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/dashboard" className="btn-primary">Ir ao painel</Link>
          <Link href="/" className="btn-secondary">Página inicial</Link>
        </div>
      </div>
    </div>
  )
}
