// src/app/dashboard/admin/receipts/[code]/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ReceiptDocument } from '@/components/receipts/ReceiptDocument'

export default async function AdminReceiptDetailPage({ params }: { params: { code: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') redirect('/login')

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
  return <ReceiptDocument receipt={receipt as any} />
}
