// src/app/api/receipts/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateReceiptCode } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const donationId = searchParams.get('donationId')

  const receipts = await prisma.receipt.findMany({
    where: donationId ? { donationId } : undefined,
    include: {
      donation: {
        include: {
          donor: { select: { id: true, name: true, farmName: true } },
          recipient: { select: { id: true, name: true, institution: true } },
          items: { include: { food: { select: { name: true, category: true } } } },
        },
      },
      issuedBy: { select: { id: true, name: true } },
    },
    orderBy: { issuedAt: 'desc' },
  })

  return NextResponse.json(receipts)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Somente admins podem emitir comprovantes manualmente' }, { status: 403 })
  }

  const { donationId, notes } = await req.json()

  const existing = await prisma.receipt.findUnique({ where: { donationId } })
  if (existing) {
    return NextResponse.json({ error: 'Comprovante já emitido para esta doação' }, { status: 409 })
  }

  const receipt = await prisma.receipt.create({
    data: {
      code: generateReceiptCode(),
      donationId,
      issuedById: session.user.id,
      notes,
    },
    include: {
      donation: {
        include: {
          donor: { select: { name: true, farmName: true } },
          recipient: { select: { name: true, institution: true } },
          items: { include: { food: { select: { name: true } } } },
        },
      },
    },
  })

  return NextResponse.json(receipt, { status: 201 })
}
