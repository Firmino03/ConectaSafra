// src/app/dashboard/beneficiario/receipts/[code]/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ReceiptDocument } from '@/components/receipts/ReceiptDocument'

export default async function ReceiptDetailPage({ params }: { params: { code: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const receipt = await prisma.receipt.findUnique({
    where: { code: params.code },
    include: {
      donation: {
        include: {
          donor: { select: { name: true, farmName: true, farmAddress: true, phone: true } },
          recipient: { select: { name: true, institution: true, registration: true, phone: true } },
          items: {
            include: { food: { select: { name: true, category: true, unit: true } } },
          },
        },
      },
      issuedBy: { select: { name: true } },
    },
  })

  if (!receipt) notFound()

  // Verificar permissão
  const isOwner = receipt.donation.recipientId === session.user.id ||
    receipt.donation.donorId === session.user.id
  if (!isOwner && session.user.role !== 'ADMIN') redirect('/dashboard')

  return <ReceiptDocument receipt={receipt as any} />
}
