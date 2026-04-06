// src/app/dashboard/admin/donations/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { DonationsTable } from '@/components/donations/DonationsTable'

export const metadata = { title: 'Gerenciar Doações' }

export default async function AdminDonationsPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') redirect('/login')

  const donations = await prisma.donation.findMany({
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
        <h1 className="font-display text-3xl font-semibold text-gray-900">Gerenciar Doações</h1>
        <p className="text-gray-500 mt-1 text-sm">Confirme, cancele e acompanhe todas as doações da plataforma</p>
      </div>
      <DonationsTable donations={donations as any} role="ADMIN" />
    </div>
  )
}
