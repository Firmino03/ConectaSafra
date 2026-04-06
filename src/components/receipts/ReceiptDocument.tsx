'use client'
// src/components/receipts/ReceiptDocument.tsx
import { useRef } from 'react'
import Link from 'next/link'
import { Printer, ArrowLeft, Sprout, CheckCircle } from 'lucide-react'
import { formatDateTime, formatDate, donationStatusLabel, donationStatusColor, foodCategoryLabel } from '@/lib/utils'

interface ReceiptProps {
  receipt: {
    id: string
    code: string
    issuedAt: Date
    notes: string | null
    issuedBy: { name: string }
    donation: {
      id: string
      code: string
      status: string
      scheduledDate: Date | null
      deliveredAt: Date | null
      notes: string | null
      donor: { name: string; farmName: string | null; farmAddress: string | null; phone: string | null }
      recipient: { name: string; institution: string | null; registration: string | null; phone: string | null }
      items: {
        quantity: number
        unit: string
        food: { name: string; category: string; unit: string }
      }[]
    }
  }
}

export function ReceiptDocument({ receipt }: ReceiptProps) {
  const printRef = useRef<HTMLDivElement>(null)

  function handlePrint() {
    window.print()
  }

  const { donation } = receipt
  const statusColor = donationStatusColor[donation.status as any] || ''

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Toolbar - no print */}
      <div className="max-w-2xl mx-auto mb-6 flex items-center justify-between no-print">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
        <button
          onClick={handlePrint}
          className="btn-primary flex items-center gap-2"
        >
          <Printer className="w-4 h-4" /> Imprimir comprovante
        </button>
      </div>

      {/* Receipt Document */}
      <div ref={printRef} className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Header */}
        <div className="bg-green-900 px-8 py-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-800/50 rounded-xl flex items-center justify-center">
                <Sprout className="w-5 h-5 text-green-200" />
              </div>
              <div>
                <p className="font-display text-lg font-semibold text-green-50">Conecta Safra</p>
                <p className="text-xs text-green-300">Do campo à comunidade</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-green-300 mb-1">Comprovante de Doação</p>
              <p className="font-mono text-base font-bold text-green-50">{receipt.code}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <CheckCircle className="w-4 h-4 text-green-300" />
            <p className="text-sm text-green-200">Emitido em {formatDateTime(receipt.issuedAt)}</p>
          </div>
        </div>

        {/* Status bar */}
        <div className={`px-8 py-3 flex items-center justify-between border-b border-gray-100 ${donationStatusColor[donation.status as any]}`}>
          <p className="text-sm font-medium">
            Status da doação: {donationStatusLabel[donation.status as any]}
          </p>
          {donation.scheduledDate && (
            <p className="text-xs">
              Agendada para {formatDate(donation.scheduledDate)}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="px-8 py-6 space-y-6">
          {/* Partes */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Doador / Produtor</p>
              <p className="font-semibold text-gray-900">{donation.donor.name}</p>
              {donation.donor.farmName && (
                <p className="text-sm text-gray-600">{donation.donor.farmName}</p>
              )}
              {donation.donor.farmAddress && (
                <p className="text-xs text-gray-500 mt-1">{donation.donor.farmAddress}</p>
              )}
              {donation.donor.phone && (
                <p className="text-xs text-gray-500">{donation.donor.phone}</p>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Beneficiário</p>
              <p className="font-semibold text-gray-900">{donation.recipient.name}</p>
              {donation.recipient.institution && (
                <p className="text-sm text-gray-600">{donation.recipient.institution}</p>
              )}
              {donation.recipient.registration && (
                <p className="text-xs text-gray-500 mt-1">Matrícula: {donation.recipient.registration}</p>
              )}
              {donation.recipient.phone && (
                <p className="text-xs text-gray-500">{donation.recipient.phone}</p>
              )}
            </div>
          </div>

          {/* Itens */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Itens da doação</p>
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Alimento</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Categoria</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Quantidade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {donation.items.map((item, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3 font-medium text-gray-900">{item.food.name}</td>
                      <td className="px-4 py-3 text-gray-500">{foodCategoryLabel[item.food.category as any]}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{item.quantity} {item.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notas */}
          {(donation.notes || receipt.notes) && (
            <div className="bg-gray-50 rounded-xl px-4 py-3">
              <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Observações</p>
              <p className="text-sm text-gray-600">{donation.notes || receipt.notes}</p>
            </div>
          )}

          {/* Entregue */}
          {donation.deliveredAt && (
            <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3">
              <p className="text-xs font-semibold text-green-700 uppercase mb-1">Entregue em</p>
              <p className="text-sm text-green-800 font-medium">{formatDateTime(donation.deliveredAt)}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400">Comprovante gerado pela plataforma Conecta Safra</p>
              <p className="text-xs text-gray-400">Emitido por: {receipt.issuedBy.name}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 font-mono">#{receipt.code}</p>
              <p className="text-xs text-gray-400 font-mono">DOA-{donation.code.slice(-8).toUpperCase()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
