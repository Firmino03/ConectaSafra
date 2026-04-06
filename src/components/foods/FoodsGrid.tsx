'use client'
// src/components/foods/FoodsGrid.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Package, Calendar, Loader2, Pencil, Trash2, X, Check } from 'lucide-react'
import { formatDate, foodCategoryLabel, foodCategoryColor } from '@/lib/utils'
import type { FoodWithProducer } from '@/types'

interface Props {
  foods: FoodWithProducer[]
  canEdit?: boolean
  onSelect?: (food: FoodWithProducer) => void
  selectedIds?: string[]
}

const CATEGORY_FILTERS = ['TODOS', 'FRUTAS', 'LEGUMES', 'VERDURAS', 'GRAOS', 'LATICINIOS', 'OUTROS']

export function FoodsGrid({ foods, canEdit = false, onSelect, selectedIds = [] }: Props) {
  const router = useRouter()
  const [filter, setFilter] = useState('TODOS')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<{ quantity: string; active: boolean }>({ quantity: '', active: true })

  const filtered = filter === 'TODOS'
    ? foods
    : foods.filter(f => f.category === filter)

  async function handleDelete(id: string) {
    if (!confirm('Remover este alimento?')) return
    setDeletingId(id)
    await fetch(`/api/foods/${id}`, { method: 'DELETE' })
    router.refresh()
    setDeletingId(null)
  }

  function startEdit(food: FoodWithProducer) {
    setEditingId(food.id)
    setEditForm({ quantity: String(food.quantity), active: food.active })
  }

  async function saveEdit(id: string) {
    await fetch(`/api/foods/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: Number(editForm.quantity), active: editForm.active }),
    })
    setEditingId(null)
    router.refresh()
  }

  const isExpiringSoon = (date: Date | null) => {
    if (!date) return false
    return new Date(date).getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {CATEGORY_FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
              ${filter === f
                ? 'bg-green-600 text-green-50 border-green-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
          >
            {f === 'TODOS' ? 'Todos' : foodCategoryLabel[f as keyof typeof foodCategoryLabel]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Nenhum alimento encontrado</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(food => {
            const isSelected = selectedIds.includes(food.id)
            const expiring = isExpiringSoon(food.expiresAt)
            const isEditing = editingId === food.id

            return (
              <div
                key={food.id}
                onClick={() => onSelect?.(food)}
                className={`card transition-all duration-150 relative
                  ${onSelect ? 'cursor-pointer hover:border-green-300 hover:shadow-sm' : ''}
                  ${isSelected ? 'border-green-500 bg-green-50/30' : ''}
                  ${!food.active ? 'opacity-50' : ''}
                `}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}

                <div className="flex items-start justify-between mb-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${foodCategoryColor[food.category]}`}>
                    {foodCategoryLabel[food.category]}
                  </span>
                  {!food.active && (
                    <span className="text-xs text-gray-400 border border-gray-200 px-2 py-0.5 rounded-full">Inativo</span>
                  )}
                </div>

                <h3 className="font-semibold text-gray-900 text-base mb-1">{food.name}</h3>

                {food.description && (
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{food.description}</p>
                )}

                {isEditing ? (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        className="input-base py-1.5 text-sm"
                        value={editForm.quantity}
                        onChange={e => setEditForm(f => ({ ...f, quantity: e.target.value }))}
                        onClick={e => e.stopPropagation()}
                      />
                      <span className="text-sm text-gray-500">{food.unit}</span>
                    </div>
                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editForm.active}
                        onChange={e => setEditForm(f => ({ ...f, active: e.target.checked }))}
                        onClick={e => e.stopPropagation()}
                        className="rounded accent-green-600"
                      />
                      Ativo
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={e => { e.stopPropagation(); saveEdit(food.id) }}
                        className="btn-primary flex-1 py-1.5 text-xs flex items-center justify-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Salvar
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); setEditingId(null) }}
                        className="btn-secondary py-1.5 px-3 text-xs"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mt-3">
                      <div>
                        <p className="text-xl font-semibold text-gray-900">{food.quantity}</p>
                        <p className="text-xs text-gray-400">{food.unit}</p>
                      </div>
                      {food.expiresAt && (
                        <div className={`text-right ${expiring ? 'text-red-600' : 'text-gray-500'}`}>
                          <Calendar className="w-3.5 h-3.5 inline mr-1" />
                          <span className="text-xs">{formatDate(food.expiresAt)}</span>
                          {expiring && <p className="text-xs font-medium">Vence em breve!</p>}
                        </div>
                      )}
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-50">
                      <p className="text-xs text-gray-400">
                        {food.producer.farmName || food.producer.name}
                      </p>
                    </div>

                    {canEdit && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={e => { e.stopPropagation(); startEdit(food) }}
                          className="btn-secondary flex-1 py-1.5 text-xs flex items-center justify-center gap-1"
                        >
                          <Pencil className="w-3 h-3" /> Editar
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); handleDelete(food.id) }}
                          disabled={deletingId === food.id}
                          className="btn-danger py-1.5 px-3 text-xs flex items-center gap-1"
                        >
                          {deletingId === food.id
                            ? <Loader2 className="w-3 h-3 animate-spin" />
                            : <Trash2 className="w-3 h-3" />
                          }
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
