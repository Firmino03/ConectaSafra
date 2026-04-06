// src/app/dashboard/beneficiario/donations/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { DonationsTable } from '@/components/donations/DonationsTable'

export const metadata = { title: 'Minhas Doações' }

export default async function BeneficiarioDonationsPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'BENEFICIARIO') redirect('/login')

  const donations = await prisma.donation.findMany({
    where: { recipientId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      donor: { select: { id: true, name: true, farmName: true, phone: true } },
      recipient: { select: { id: true, name: true, institution: true, phone: true } },
      items: { include: { food: { select: { id: true, name: true, category: true } } } },
      receipt: { select: { id: true, code: true, issuedAt: true } },
    },
  })

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-gray-900">Minhas Doações</h1>
        <p className="text-gray-500 mt-1 text-sm">Acompanhe o status de todas as suas solicitações</p>
      </div>
      <DonationsTable donations={donations as any} role="BENEFICIARIO" />
    </div>
  )
}
