// src/app/api/donations/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { generateReceiptCode } from '@/lib/utils'

const donationSchema = z.object({
  donorId: z.string(),
  notes: z.string().optional(),
  scheduledDate: z.string().optional(),
  items: z.array(z.object({
    foodId: z.string(),
    quantity: z.number().positive(),
    unit: z.string(),
  })).min(1, 'Adicione ao menos um item'),
})

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    const where: any = {}
    if (status) where.status = status
    if (session.user.role === 'PRODUTOR') where.donorId = session.user.id
    if (session.user.role === 'BENEFICIARIO') where.recipientId = session.user.id

    const donations = await prisma.donation.findMany({
      where,
      include: {
        donor: { select: { id: true, name: true, farmName: true, phone: true } },
        recipient: { select: { id: true, name: true, institution: true, phone: true } },
        items: {
          include: { food: { select: { id: true, name: true, category: true } } },
        },
        receipt: { select: { id: true, code: true, issuedAt: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(donations)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'BENEFICIARIO') {
      return NextResponse.json({ error: 'Somente beneficiários podem solicitar doações' }, { status: 403 })
    }

    const body = await req.json()
    const data = donationSchema.parse(body)

    const donation = await prisma.donation.create({
      data: {
        donorId: data.donorId,
        recipientId: session.user.id,
        notes: data.notes,
        scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : null,
        items: {
          create: data.items.map(item => ({
            foodId: item.foodId,
            quantity: item.quantity,
            unit: item.unit,
          })),
        },
      },
      include: {
        donor: { select: { id: true, name: true, farmName: true } },
        recipient: { select: { id: true, name: true, institution: true } },
        items: { include: { food: { select: { id: true, name: true, category: true } } } },
      },
    })

    // Emitir comprovante automaticamente
    const receiptCode = generateReceiptCode()
    await prisma.receipt.create({
      data: {
        code: receiptCode,
        donationId: donation.id,
        issuedById: session.user.id,
        notes: 'Comprovante emitido automaticamente após solicitação',
      },
    })

    return NextResponse.json(donation, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    }
    console.error(err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
