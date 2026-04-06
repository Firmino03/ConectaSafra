'use client'
// src/app/dashboard/beneficiario/foods/page.tsx
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, X, Loader2, Plus, Minus, Send } from 'lucide-react'
import { FoodsGrid } from '@/components/foods/FoodsGrid'
import type { FoodWithProducer } from '@/types'
import { foodCategoryLabel } from '@/lib/utils'

interface CartItem {
  food: FoodWithProducer
  quantity: number
}

export default function BeneficiarioFoodsPage() {
  const router = useRouter()
  const [foods, setFoods] = useState<FoodWithProducer[]>([])
  const [producers, setProducers] = useState<{ id: string; name: string; farmName: string | null }[]>([])
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [notes, setNotes] = useState('')
  const [selectedProducer, setSelectedProducer] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetch('/api/foods?active=true')
      .then(r => r.json())
      .then(data => {
        setFoods(data)
        const map = new Map()
        data.forEach((f: FoodWithProducer) => map.set(f.producer.id, f.producer))
        setProducers(Array.from(map.values()))
        setLoading(false)
      })
  }, [])

  function toggleCart(food: FoodWithProducer) {
    setCart(prev => {
      const exists = prev.find(i => i.food.id === food.id)
      if (exists) return prev.filter(i => i.food.id !== food.id)
      return [...prev, { food, quantity: 1 }]
    })
  }

  function adjustQty(foodId: string, delta: number) {
    setCart(prev => prev.map(item =>
      item.food.id === foodId
        ? { ...item, quantity: Math.max(1, Math.min(item.food.quantity, item.quantity + delta)) }
        : item
    ))
  }

  const selectedIds = cart.map(i => i.food.id)
  const cartProducers = [...new Set(cart.map(i => i.food.producer.id))]
  const donorId = cartProducers.length === 1 ? cartProducers[0] : selectedProducer

  async function handleSubmit() {
    if (cart.length === 0) return
    if (!donorId) { alert('Todos os itens devem ser do mesmo produtor'); return }

    setSubmitting(true)
    const res = await fetch('/api/donations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        donorId,
        notes,
        items: cart.map(item => ({
          foodId: item.food.id,
          quantity: item.quantity,
          unit: item.food.unit,
        })),
      }),
    })

    if (res.ok) {
      setCart([])
      setCartOpen(false)
      setSuccess('Doação solicitada com sucesso! Comprovante emitido.')
      router.refresh()
      setTimeout(() => setSuccess(''), 5000)
    } else {
      const data = await res.json()
      alert(data.error || 'Erro ao solicitar doação')
    }
    setSubmitting(false)
  }

  return (
    <div className="p-8 animate-fade-in">
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
          <span>✅ {success}</span>
          <button onClick={() => setSuccess('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold text-gray-900">Alimentos disponíveis</h1>
          <p className="text-gray-500 mt-1 text-sm">Selecione os itens e solicite sua doação</p>
        </div>
        {cart.length > 0 && (
          <button
            onClick={() => setCartOpen(true)}
            className="btn-primary flex items-center gap-2 relative"
          >
            <ShoppingCart className="w-4 h-4" />
            Minha seleção
            <span className="bg-green-100 text-green-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {cart.length}
            </span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-green-600" />
        </div>
      ) : (
        <FoodsGrid
          foods={foods}
          onSelect={toggleCart}
          selectedIds={selectedIds}
        />
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 bg-black/30 z-50 flex justify-end" onClick={() => setCartOpen(false)}>
          <div
            className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-gray-900">Solicitação de doação</h2>
              <button onClick={() => setCartOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.map(item => (
                <div key={item.food.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{item.food.name}</p>
                    <p className="text-xs text-gray-500">{foodCategoryLabel[item.food.category]}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.food.producer.farmName || item.food.producer.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => adjustQty(item.food.id, -1)} className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100">
                      <Minus className="w-3 h-3 text-gray-600" />
                    </button>
                    <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                    <button onClick={() => adjustQty(item.food.id, 1)} className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100">
                      <Plus className="w-3 h-3 text-gray-600" />
                    </button>
                    <span className="text-xs text-gray-500 w-10">{item.food.unit}</span>
                    <button onClick={() => toggleCart(item.food)} className="ml-1 text-red-400 hover:text-red-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {cartProducers.length > 1 && (
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                  <p className="text-xs text-amber-800 font-medium mb-2">Itens de múltiplos produtores. Selecione o produtor principal:</p>
                  <select className="input-base text-sm" value={selectedProducer} onChange={e => setSelectedProducer(e.target.value)}>
                    <option value="">Selecione...</option>
                    {producers.filter(p => cartProducers.includes(p.id)).map(p => (
                      <option key={p.id} value={p.id}>{p.farmName || p.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Observações (opcional)</label>
                <textarea
                  className="input-base resize-none"
                  rows={3}
                  placeholder="Horário preferido para retirada, local, etc."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-100">
              <div className="bg-green-50 border border-green-100 rounded-lg p-3 mb-4">
                <p className="text-xs text-green-800">
                  Um comprovante será emitido automaticamente após a solicitação.
                </p>
              </div>
              <button
                onClick={handleSubmit}
                disabled={submitting || !donorId}
                className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-base"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {submitting ? 'Enviando solicitação...' : 'Solicitar doação'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
