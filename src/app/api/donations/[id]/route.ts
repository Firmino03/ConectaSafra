// src/app/api/donations/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const donation = await prisma.donation.findUnique({
    where: { id: params.id },
    include: {
      donor: { select: { id: true, name: true, farmName: true, farmAddress: true, phone: true } },
      recipient: { select: { id: true, name: true, institution: true, registration: true, phone: true } },
      items: { include: { food: true } },
      receipt: { include: { issuedBy: { select: { id: true, name: true } } } },
    },
  })

  if (!donation) return NextResponse.json({ error: 'Doação não encontrada' }, { status: 404 })

  // Verificar permissão de acesso
  const isOwner = donation.donorId === session.user.id || donation.recipientId === session.user.id
  if (!isOwner && session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
  }

  return NextResponse.json(donation)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const donation = await prisma.donation.findUnique({ where: { id: params.id } })
  if (!donation) return NextResponse.json({ error: 'Não encontrada' }, { status: 404 })

  const body = await req.json()
  const { status, notes } = body

  // Regras de transição de status
  const allowed: Record<string, string[]> = {
    ADMIN: ['CONFIRMADA', 'CANCELADA'],
    PRODUTOR: ['CANCELADA'],
    BENEFICIARIO: [],
  }

  if (status && !allowed[session.user.role]?.includes(status)) {
    return NextResponse.json({ error: 'Transição de status não permitida' }, { status: 403 })
  }

  const updateData: any = {}
  if (status) updateData.status = status
  if (notes) updateData.notes = notes
  if (status === 'ENTREGUE') updateData.deliveredAt = new Date()

  const updated = await prisma.donation.update({
    where: { id: params.id },
    data: updateData,
    include: {
      donor: { select: { id: true, name: true, farmName: true } },
      recipient: { select: { id: true, name: true, institution: true } },
      items: { include: { food: { select: { id: true, name: true, category: true } } } },
      receipt: { select: { id: true, code: true, issuedAt: true } },
    },
  })

  return NextResponse.json(updated)
}
