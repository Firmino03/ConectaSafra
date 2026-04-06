'use client'
// src/components/donations/DonationsTable.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Eye, CheckCircle, XCircle, Truck } from 'lucide-react'
import { formatRelative, donationStatusLabel, donationStatusColor, foodCategoryLabel } from '@/lib/utils'
import type { DonationWithDetails } from '@/types'
import { DonationStatus } from '@prisma/client'

interface Props {
  donations: DonationWithDetails[]
  role: 'ADMIN' | 'PRODUTOR' | 'BENEFICIARIO'
}

const STATUS_FILTERS = ['TODOS', 'PENDENTE', 'CONFIRMADA', 'ENTREGUE', 'CANCELADA']

export function DonationsTable({ donations, role }: Props) {
  const router = useRouter()
  const [filter, setFilter] = useState('TODOS')
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [selected, setSelected] = useState<DonationWithDetails | null>(null)

  const filtered = filter === 'TODOS' ? donations : donations.filter(d => d.status === filter)

  async function updateStatus(id: string, status: DonationStatus) {
    setLoadingId(id)
    await fetch(`/api/donations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    router.refresh()
    setLoadingId(null)
    setSelected(null)
  }

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {STATUS_FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
              ${filter === f
                ? 'bg-green-600 text-green-50 border-green-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
          >
            {f === 'TODOS' ? 'Todas' : donationStatusLabel[f as DonationStatus]}
            {f !== 'TODOS' && (
              <span className="ml-1.5 opacity-70">
                {donations.filter(d => d.status === f).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Modal de detalhes */}
      {selected && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-xl font-semibold text-gray-900">Detalhes da Doação</h3>
                  <p className="text-xs text-gray-500 mt-0.5 font-mono">{selected.code}</p>
                </div>
                <span className={`badge ${donationStatusColor[selected.status]}`}>{donationStatusLabel[selected.status]}</span>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase mb-1">Produtor</p>
                  <p className="text-sm font-medium text-gray-900">{selected.donor.name}</p>
                  <p className="text-xs text-gray-500">{selected.donor.farmName || '—'}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase mb-1">Beneficiário</p>
                  <p className="text-sm font-medium text-gray-900">{selected.recipient.name}</p>
                  <p className="text-xs text-gray-500">{selected.recipient.institution || '—'}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase mb-2">Itens da doação</p>
                <div className="space-y-2">
                  {selected.items.map(item => (
                    <div key={item.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.food.name}</p>
                        <p className="text-xs text-gray-500">{foodCategoryLabel[item.food.category]}</p>
                      </div>
                      <p className="text-sm font-medium text-gray-700">{item.quantity} {item.unit}</p>
                    </div>
                  ))}
                </div>
              </div>
              {selected.receipt && (
                <div className="bg-green-50 border border-green-100 rounded-lg px-3 py-2">
                  <p className="text-xs font-medium text-green-800">Comprovante: <span className="font-mono">{selected.receipt.code}</span></p>
                </div>
              )}
              {selected.notes && (
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase mb-1">Observações</p>
                  <p className="text-sm text-gray-600">{selected.notes}</p>
                </div>
              )}
            </div>
            {role === 'ADMIN' && selected.status === 'PENDENTE' && (
              <div className="p-6 pt-0 flex gap-3">
                <button
                  onClick={() => updateStatus(selected.id, 'CONFIRMADA')}
                  disabled={!!loadingId}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {loadingId === selected.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  Confirmar
                </button>
                <button
                  onClick={() => updateStatus(selected.id, 'CANCELADA')}
                  disabled={!!loadingId}
                  className="btn-danger flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" /> Cancelar
                </button>
              </div>
            )}
            {role === 'ADMIN' && selected.status === 'CONFIRMADA' && (
              <div className="p-6 pt-0">
                <button
                  onClick={() => updateStatus(selected.id, 'ENTREGUE')}
                  disabled={!!loadingId}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {loadingId === selected.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4" />}
                  Marcar como entregue
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Nenhuma doação encontrada</p>
          </div>
        ) : (
          <table className="table-base">
            <thead>
              <tr>
                <th>Produtor</th>
                <th>Beneficiário</th>
                <th>Itens</th>
                <th>Status</th>
                <th>Comprovante</th>
                <th>Data</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id}>
                  <td>
                    <p className="font-medium text-gray-900 text-sm">{d.donor.name}</p>
                    <p className="text-xs text-gray-400">{d.donor.farmName || '—'}</p>
                  </td>
                  <td>
                    <p className="text-sm text-gray-700">{d.recipient.name}</p>
                    <p className="text-xs text-gray-400">{d.recipient.institution || '—'}</p>
                  </td>
                  <td className="text-sm text-gray-600">{d.items.length} item(s)</td>
                  <td>
                    <span className={`badge ${donationStatusColor[d.status]}`}>
                      {donationStatusLabel[d.status]}
                    </span>
                  </td>
                  <td>
                    {d.receipt
                      ? <span className="text-xs font-mono text-green-700">{d.receipt.code}</span>
                      : <span className="text-xs text-gray-400">—</span>
                    }
                  </td>
                  <td className="text-xs text-gray-500">{formatRelative(d.createdAt)}</td>
                  <td>
                    <button
                      onClick={() => setSelected(d)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function ClipboardList({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  )
}
