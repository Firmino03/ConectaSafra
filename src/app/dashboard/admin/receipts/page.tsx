// src/app/dashboard/admin/receipts/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatDateTime, donationStatusLabel, donationStatusColor } from '@/lib/utils'
import { FileText, ExternalLink } from 'lucide-react'

export const metadata = { title: 'Comprovantes' }

export default async function AdminReceiptsPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') redirect('/login')

  const receipts = await prisma.receipt.findMany({
    orderBy: { issuedAt: 'desc' },
    include: {
      donation: {
        include: {
          donor: { select: { name: true, farmName: true } },
          recipient: { select: { name: true, institution: true } },
          items: { include: { food: { select: { name: true } } } },
        },
      },
      issuedBy: { select: { name: true } },
    },
  })

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-gray-900">Comprovantes</h1>
        <p className="text-gray-500 mt-1 text-sm">{receipts.length} comprovante{receipts.length !== 1 ? 's' : ''} emitido{receipts.length !== 1 ? 's' : ''} na plataforma</p>
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="table-base">
          <thead>
            <tr>
              <th>Código</th>
              <th>Doador</th>
              <th>Beneficiário</th>
              <th>Itens</th>
              <th>Status</th>
              <th>Emitido em</th>
              <th>Emitido por</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {receipts.map(r => (
              <tr key={r.id}>
                <td>
                  <span className="font-mono text-xs font-medium text-green-700">{r.code}</span>
                </td>
                <td>
                  <p className="text-sm font-medium text-gray-900">{r.donation.donor.name}</p>
                  <p className="text-xs text-gray-400">{r.donation.donor.farmName || '—'}</p>
                </td>
                <td>
                  <p className="text-sm text-gray-700">{r.donation.recipient.name}</p>
                  <p className="text-xs text-gray-400">{r.donation.recipient.institution || '—'}</p>
                </td>
                <td className="text-sm text-gray-600">
                  {r.donation.items.map(i => i.food.name).join(', ')}
                </td>
                <td>
                  <span className={`badge ${donationStatusColor[r.donation.status]}`}>
                    {donationStatusLabel[r.donation.status]}
                  </span>
                </td>
                <td className="text-xs text-gray-500">{formatDateTime(r.issuedAt)}</td>
                <td className="text-xs text-gray-500">{r.issuedBy.name}</td>
                <td>
                  <Link
                    href={`/dashboard/admin/receipts/${r.code}`}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-green-700 flex items-center"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
