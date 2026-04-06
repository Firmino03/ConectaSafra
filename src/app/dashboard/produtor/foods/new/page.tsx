'use client'
// src/app/dashboard/produtor/foods/new/page.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Plus } from 'lucide-react'

const CATEGORIES = [
  { value: 'FRUTAS', label: 'Frutas' },
  { value: 'LEGUMES', label: 'Legumes' },
  { value: 'VERDURAS', label: 'Verduras' },
  { value: 'GRAOS', label: 'Grãos' },
  { value: 'LATICINIOS', label: 'Laticínios' },
  { value: 'OUTROS', label: 'Outros' },
]

const UNITS = ['kg', 'g', 'unidade', 'caixa', 'cesta', 'litro', 'dúzia', 'maço']

export default function NewFoodPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    unit: 'kg',
    quantity: '',
    expiresAt: '',
  })

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.category) { setError('Selecione uma categoria'); return }
    setLoading(true)
    setError('')

    const res = await fetch('/api/foods', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        quantity: Number(form.quantity),
        expiresAt: form.expiresAt || undefined,
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Erro ao cadastrar alimento')
      setLoading(false)
      return
    }

    router.push('/dashboard/produtor/foods')
    router.refresh()
  }

  return (
    <div className="p-8 animate-fade-in max-w-2xl">
      <div className="mb-8">
        <Link href="/dashboard/produtor/foods" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar aos alimentos
        </Link>
        <h1 className="font-display text-3xl font-semibold text-gray-900">Cadastrar alimento</h1>
        <p className="text-gray-500 mt-1 text-sm">Adicione um novo alimento disponível para doação</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome do alimento *</label>
          <input className="input-base" placeholder="Ex: Tomate cereja, Manga tommy..." value={form.name} onChange={e => set('name', e.target.value)} required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Categoria *</label>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                type="button"
                onClick={() => set('category', cat.value)}
                className={`py-2 px-3 border rounded-lg text-sm transition-all text-center
                  ${form.category === cat.value
                    ? 'border-green-600 bg-green-50 text-green-800 font-medium'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Quantidade *</label>
            <input type="number" min="0.1" step="0.1" className="input-base" placeholder="0" value={form.quantity} onChange={e => set('quantity', e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Unidade *</label>
            <select className="input-base" value={form.unit} onChange={e => set('unit', e.target.value)}>
              {UNITS.map(u => <option key={u}>{u}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Data de validade</label>
          <input type="date" className="input-base" value={form.expiresAt} onChange={e => set('expiresAt', e.target.value)} min={new Date().toISOString().split('T')[0]} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Descrição</label>
          <textarea
            className="input-base resize-none"
            rows={3}
            placeholder="Informações adicionais sobre o alimento, forma de colheita, etc."
            value={form.description}
            onChange={e => set('description', e.target.value)}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Link href="/dashboard/produtor/foods" className="btn-secondary flex-1 text-center py-2.5">Cancelar</Link>
          <button type="submit" disabled={loading} className="btn-primary flex-1 py-2.5 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {loading ? 'Cadastrando...' : 'Cadastrar alimento'}
          </button>
        </div>
      </form>
    </div>
  )
}
