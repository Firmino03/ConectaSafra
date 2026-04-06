'use client'
// src/app/dashboard/admin/donations/[id]/page.tsx
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, XCircle, Truck, Loader2, FileText, Calendar, MapPin, Phone } from 'lucide-react'
import { formatDateTime, formatDate, donationStatusLabel, donationStatusColor, foodCategoryLabel } from '@/lib/utils'
import { useToast } from '@/components/ui/Toast'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Skeleton } from '@/components/ui/Skeleton'

export default function DonationDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { success, error: toastError } = useToast()
  const [donation, setDonation] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [confirm, setConfirm] = useState<{ action: string; label: string } | null>(null)

  useEffect(() => {
    fetch(`/api/donations/${params.id}`)
      .then(r => r.json())
      .then(data => { setDonation(data); setLoading(false) })
      .catch(() => router.push('/dashboard/admin/donations'))
  }, [params.id])

  async function handleAction(status: string) {
    setActionLoading(true)
    const res = await fetch(`/api/donations/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })

    if (res.ok) {
      const updated = await res.json()
      setDonation(updated)
      success(
        status === 'CONFIRMADA' ? 'Doação confirmada!' :
        status === 'ENTREGUE'   ? 'Marcada como entregue!' : 'Doação cancelada',
        'O status foi atualizado com sucesso.'
      )
    } else {
      toastError('Erro', 'Não foi possível atualizar o status')
    }
    setActionLoading(false)
    setConfirm(null)
  }

  if (loading) {
    return (
      <div className="p-8 max-w-3xl animate-fade-in space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-64" />
        <div className="card space-y-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-4 w-full" />)}
        </div>
      </div>
    )
  }

  if (!donation) return null

  return (
    <div className="p-8 max-w-3xl animate-fade-in">
      <Link href="/dashboard/admin/donations" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar às doações
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-semibold text-gray-900">Detalhes da Doação</h1>
          <p className="text-xs font-mono text-gray-400 mt-1">#{donation.code}</p>
        </div>
        <span className={`badge ${donationStatusColor[donation.status]} text-sm px-3 py-1.5`}>
          {donationStatusLabel[donation.status]}
        </span>
      </div>

      {/* Action bar */}
      {donation.status === 'PENDENTE' && (
        <div className="flex gap-3 mb-6 p-4 bg-amber-50 border border-amber-100 rounded-xl">
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800">Doação aguardando confirmação</p>
            <p className="text-xs text-amber-600 mt-0.5">Revise os detalhes e confirme ou cancele esta doação</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setConfirm({ action: 'CONFIRMADA', label: 'Confirmar doação' })}
              className="btn-primary flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" /> Confirmar
            </button>
            <button
              onClick={() => setConfirm({ action: 'CANCELADA', label: 'Cancelar doação' })}
              className="btn-danger flex items-center gap-2"
            >
              <XCircle className="w-4 h-4" /> Cancelar
            </button>
          </div>
        </div>
      )}

      {donation.status === 'CONFIRMADA' && (
        <div className="flex gap-3 mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-800">Doação confirmada — aguardando entrega</p>
            <p className="text-xs text-blue-600 mt-0.5">Marque como entregue após o beneficiário retirar os alimentos</p>
          </div>
          <button
            onClick={() => setConfirm({ action: 'ENTREGUE', label: 'Marcar como entregue' })}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Truck className="w-4 h-4" /> Marcar entregue
          </button>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        {/* Produtor */}
        <div className="card">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Doador / Produtor</p>
          <div className="space-y-2">
            <p className="font-semibold text-gray-900">{donation.donor.name}</p>
            {donation.donor.farmName && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                {donation.donor.farmName}
              </div>
            )}
            {donation.donor.farmAddress && (
              <p className="text-xs text-gray-400 pl-5">{donation.donor.farmAddress}</p>
            )}
            {donation.donor.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                {donation.donor.phone}
              </div>
            )}
          </div>
        </div>

        {/* Beneficiário */}
        <div className="card">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Beneficiário</p>
          <div className="space-y-2">
            <p className="font-semibold text-gray-900">{donation.recipient.name}</p>
            {donation.recipient.institution && (
              <p className="text-sm text-gray-600">{donation.recipient.institution}</p>
            )}
            {donation.recipient.registration && (
              <p className="text-xs text-gray-400">Matrícula: {donation.recipient.registration}</p>
            )}
            {donation.recipient.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                {donation.recipient.phone}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Itens */}
      <div className="card mb-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Itens da doação</p>
        <div className="border border-gray-100 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Alimento</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Categoria</th>
                <th className="text-right px-4 py-2.5 text-xs font-medium text-gray-500">Quantidade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {donation.items.map((item: any) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 font-medium text-gray-900">{item.food.name}</td>
                  <td className="px-4 py-3 text-gray-500">{foodCategoryLabel[item.food.category]}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{item.quantity} {item.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Timeline / Datas */}
      <div className="card mb-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Linha do tempo</p>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Doação solicitada</p>
              <p className="text-xs text-gray-400">{formatDateTime(donation.createdAt)}</p>
            </div>
          </div>
          {donation.scheduledDate && (
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <Calendar className="w-3 h-3 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Data agendada para retirada</p>
                <p className="text-xs text-gray-400">{formatDate(donation.scheduledDate)}</p>
              </div>
            </div>
          )}
          {donation.deliveredAt && (
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center">
                <Truck className="w-3 h-3 text-teal-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Entregue ao beneficiário</p>
                <p className="text-xs text-gray-400">{formatDateTime(donation.deliveredAt)}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comprovante */}
      {donation.receipt && (
        <div className="card bg-green-50 border-green-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center">
                <FileText className="w-4 h-4 text-green-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-900">Comprovante emitido</p>
                <p className="font-mono text-xs text-green-700">{donation.receipt.code}</p>
              </div>
            </div>
            <Link
              href={`/dashboard/admin/receipts/${donation.receipt.code}`}
              className="text-xs text-green-700 font-medium hover:underline"
            >
              Ver comprovante →
            </Link>
          </div>
        </div>
      )}

      {/* Notes */}
      {donation.notes && (
        <div className="mt-5 card">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Observações</p>
          <p className="text-sm text-gray-600">{donation.notes}</p>
        </div>
      )}

      {/* Confirm Dialog */}
      {confirm && (
        <ConfirmDialog
          open={true}
          loading={actionLoading}
          title={confirm.label}
          description={
            confirm.action === 'CANCELADA'
              ? 'Esta ação não pode ser desfeita. A doação será marcada como cancelada.'
              : confirm.action === 'CONFIRMADA'
              ? 'Confirme que esta doação foi validada e está pronta para entrega.'
              : 'Confirme que os alimentos foram entregues ao beneficiário.'
          }
          variant={confirm.action === 'CANCELADA' ? 'danger' : 'default'}
          confirmLabel={confirm.label}
          onConfirm={() => handleAction(confirm.action)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  )
}
