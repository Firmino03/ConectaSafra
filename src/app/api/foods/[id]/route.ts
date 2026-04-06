// src/app/api/foods/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const food = await prisma.food.findUnique({
    where: { id: params.id },
    include: { producer: { select: { id: true, name: true, farmName: true, farmAddress: true, phone: true } } },
  })

  if (!food) return NextResponse.json({ error: 'Alimento não encontrado' }, { status: 404 })
  return NextResponse.json(food)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const food = await prisma.food.findUnique({ where: { id: params.id } })
  if (!food) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })

  if (session.user.role === 'PRODUTOR' && food.producerId !== session.user.id) {
    return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
  }

  const body = await req.json()
  const updated = await prisma.food.update({
    where: { id: params.id },
    data: {
      ...body,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
    },
  })

  return NextResponse.json(updated)
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const food = await prisma.food.findUnique({ where: { id: params.id } })
  if (!food) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })

  if (session.user.role === 'PRODUTOR' && food.producerId !== session.user.id) {
    return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
  }

  // Soft delete
  await prisma.food.update({ where: { id: params.id }, data: { active: false } })
  return NextResponse.json({ message: 'Alimento removido' })
}
