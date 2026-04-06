'use client'
// src/app/dashboard/produtor/foods/[id]/edit/page.tsx
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

const CATEGORIES = [
  { value: 'FRUTAS',    label: '🍎 Frutas' },
  { value: 'LEGUMES',   label: '🥕 Legumes' },
  { value: 'VERDURAS',  label: '🥬 Verduras' },
  { value: 'GRAOS',     label: '🌾 Grãos' },
  { value: 'LATICINIOS',label: '🧀 Laticínios' },
  { value: 'OUTROS',    label: '📦 Outros' },
]

const UNITS = ['kg', 'g', 'unidade', 'caixa', 'cesta', 'litro', 'dúzia', 'maço']

export default function EditFoodPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { success, error: toastError } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '', description: '', category: '',
    unit: 'kg', quantity: '', expiresAt: '', active: true,
  })

  useEffect(() => {
    fetch(`/api/foods/${params.id}`)
      .then(r => r.json())
      .then(data => {
        setForm({
          name: data.name || '',
          description: data.description || '',
          category: data.category || '',
          unit: data.unit || 'kg',
          quantity: String(data.quantity || ''),
          expiresAt: data.expiresAt ? data.expiresAt.split('T')[0] : '',
          active: data.active ?? true,
        })
        setLoading(false)
      })
      .catch(() => {
        toastError('Erro', 'Alimento não encontrado')
        router.push('/dashboard/produtor/foods')
      })
  }, [params.id])

  function set(field: string, value: string | boolean) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.category) { toastError('Erro', 'Selecione uma categoria'); return }
    setSaving(true)

    const res = await fetch(`/api/foods/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        quantity: Number(form.quantity),
        expiresAt: form.expiresAt || null,
      }),
    })

    if (res.ok) {
      success('Alimento atualizado!', 'As alterações foram salvas com sucesso.')
      router.push('/dashboard/produtor/foods')
      router.refresh()
    } else {
      const data = await res.json()
      toastError('Erro ao salvar', data.error || 'Tente novamente')
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <Loader2 className="w-6 h-6 animate-spin text-green-600" />
      </div>
    )
  }

  return (
    <div className="p-8 animate-fade-in max-w-2xl">
      <div className="mb-8">
        <Link href="/dashboard/produtor/foods" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar aos alimentos
        </Link>
        <h1 className="font-display text-3xl font-semibold text-gray-900">Editar alimento</h1>
        <p className="text-gray-500 mt-1 text-sm">Atualize as informações do alimento</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome do alimento *</label>
          <input className="input-base" value={form.name} onChange={e => set('name', e.target.value)} required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Categoria *</label>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                type="button"
                onClick={() => set('category', cat.value)}
                className={`py-2 px-3 border rounded-lg text-sm transition-all text-left
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
            <input type="number" min="0.1" step="0.1" className="input-base"
              value={form.quantity} onChange={e => set('quantity', e.target.value)} required />
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
          <input type="date" className="input-base" value={form.expiresAt}
            onChange={e => set('expiresAt', e.target.value)}
            min={new Date().toISOString().split('T')[0]} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Descrição</label>
          <textarea className="input-base resize-none" rows={3}
            value={form.description} onChange={e => set('description', e.target.value)} />
        </div>

        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
          <input
            type="checkbox"
            id="active"
            checked={form.active}
            onChange={e => set('active', e.target.checked)}
            className="w-4 h-4 accent-green-600 rounded"
          />
          <div>
            <label htmlFor="active" className="text-sm font-medium text-gray-700 cursor-pointer">
              Alimento ativo
            </label>
            <p className="text-xs text-gray-400">Desmarque para ocultar este alimento das listagens</p>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Link href="/dashboard/produtor/foods" className="btn-secondary flex-1 text-center py-2.5">
            Cancelar
          </Link>
          <button type="submit" disabled={saving} className="btn-primary flex-1 py-2.5 flex items-center justify-center gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </div>
      </form>
    </div>
  )
}
