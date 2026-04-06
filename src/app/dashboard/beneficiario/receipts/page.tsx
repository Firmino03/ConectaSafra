// src/app/dashboard/beneficiario/receipts/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatDateTime, donationStatusLabel, donationStatusColor, foodCategoryLabel } from '@/lib/utils'
import { FileText, ExternalLink } from 'lucide-react'

export const metadata = { title: 'Meus Comprovantes' }

export default async function BeneficiarioReceiptsPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'BENEFICIARIO') redirect('/login')

  const receipts = await prisma.receipt.findMany({
    where: { donation: { recipientId: session.user.id } },
    orderBy: { issuedAt: 'desc' },
    include: {
      donation: {
        include: {
          donor: { select: { name: true, farmName: true } },
          items: { include: { food: { select: { name: true, category: true } } } },
        },
      },
      issuedBy: { select: { name: true } },
    },
  })

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-gray-900">Meus Comprovantes</h1>
        <p className="text-gray-500 mt-1 text-sm">{receipts.length} comprovante{receipts.length !== 1 ? 's' : ''} emitido{receipts.length !== 1 ? 's' : ''}</p>
      </div>

      {receipts.length === 0 ? (
        <div className="card text-center py-16">
          <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 text-sm">Nenhum comprovante emitido ainda</p>
          <Link href="/dashboard/beneficiario/foods" className="text-xs text-green-700 mt-2 inline-block hover:underline">
            Fazer primeira solicitação →
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {receipts.map(receipt => (
            <div key={receipt.id} className="card hover:border-green-200 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-green-700" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-mono text-sm font-semibold text-gray-900">{receipt.code}</p>
                      <span className={`badge ${donationStatusColor[receipt.donation.status]}`}>
                        {donationStatusLabel[receipt.donation.status]}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">
                      Emitido em {formatDateTime(receipt.issuedAt)} · por {receipt.issuedBy.name}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {receipt.donation.items.map(item => (
                        <span key={item.food.name} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {item.food.name}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Produtor: {receipt.donation.donor.farmName || receipt.donation.donor.name}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/dashboard/beneficiario/receipts/${receipt.code}`}
                  className="flex items-center gap-1.5 text-xs text-green-700 font-medium hover:underline ml-4 whitespace-nowrap"
                >
                  Ver comprovante <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
