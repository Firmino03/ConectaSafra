// src/app/api/foods/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const foodSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  category: z.enum(['FRUTAS', 'LEGUMES', 'VERDURAS', 'GRAOS', 'LATICINIOS', 'OUTROS']),
  unit: z.string().min(1),
  quantity: z.number().positive(),
  expiresAt: z.string().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const producerId = searchParams.get('producerId')
    const activeOnly = searchParams.get('active') !== 'false'

    const foods = await prisma.food.findMany({
      where: {
        ...(activeOnly ? { active: true } : {}),
        ...(category ? { category: category as any } : {}),
        ...(producerId ? { producerId } : {}),
        // Produtor só vê seus próprios alimentos
        ...(session.user.role === 'PRODUTOR' ? { producerId: session.user.id } : {}),
      },
      include: {
        producer: { select: { id: true, name: true, farmName: true } },
        _count: { select: { donationItems: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(foods)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'PRODUTOR') {
      return NextResponse.json({ error: 'Somente produtores podem cadastrar alimentos' }, { status: 403 })
    }

    const body = await req.json()
    const data = foodSchema.parse(body)

    const food = await prisma.food.create({
      data: {
        ...data,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        producerId: session.user.id,
      },
      include: { producer: { select: { id: true, name: true, farmName: true } } },
    })

    return NextResponse.json(food, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
