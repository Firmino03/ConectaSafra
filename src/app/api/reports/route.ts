// src/app/api/reports/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') || 'overview'

  if (type === 'monthly') {
    // Doações por mês nos últimos 6 meses
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(new Date(), 5 - i)
      return {
        label: format(date, 'MMM', { locale: ptBR }),
        start: startOfMonth(date),
        end: endOfMonth(date),
      }
    })

    const data = await Promise.all(
      months.map(async (m) => {
        const [total, delivered, pending] = await Promise.all([
          prisma.donation.count({
            where: { createdAt: { gte: m.start, lte: m.end } },
          }),
          prisma.donation.count({
            where: { createdAt: { gte: m.start, lte: m.end }, status: 'ENTREGUE' },
          }),
          prisma.donation.count({
            where: { createdAt: { gte: m.start, lte: m.end }, status: 'PENDENTE' },
          }),
        ])
        return { label: m.label, total, delivered, pending }
      })
    )

    return NextResponse.json(data)
  }

  if (type === 'categories') {
    // Doações por categoria de alimento
    const items = await prisma.donationItem.findMany({
      include: { food: { select: { category: true } } },
    })

    const byCategory: Record<string, number> = {}
    items.forEach(item => {
      const cat = item.food.category
      byCategory[cat] = (byCategory[cat] || 0) + 1
    })

    return NextResponse.json(
      Object.entries(byCategory).map(([category, count]) => ({ category, count }))
    )
  }

  if (type === 'top-producers') {
    // Top produtores por número de doações
    const producers = await prisma.user.findMany({
      where: { role: 'PRODUTOR', active: true },
      select: {
        id: true,
        name: true,
        farmName: true,
        _count: { select: { donations: true, foods: true } },
      },
      orderBy: { donations: { _count: 'desc' } },
      take: 10,
    })

    return NextResponse.json(producers)
  }

  if (type === 'top-recipients') {
    // Top beneficiários
    const recipients = await prisma.user.findMany({
      where: { role: 'BENEFICIARIO', active: true },
      select: {
        id: true,
        name: true,
        institution: true,
        _count: { select: { receipts: true } },
      },
      orderBy: { receipts: { _count: 'desc' } },
      take: 10,
    })

    return NextResponse.json(recipients)
  }

  // Overview
  const [
    totalDonations, deliveredDonations, pendingDonations,
    cancelledDonations, totalFoods, totalUsers,
    totalReceipts,
  ] = await Promise.all([
    prisma.donation.count(),
    prisma.donation.count({ where: { status: 'ENTREGUE' } }),
    prisma.donation.count({ where: { status: 'PENDENTE' } }),
    prisma.donation.count({ where: { status: 'CANCELADA' } }),
    prisma.food.count({ where: { active: true } }),
    prisma.user.count({ where: { active: true } }),
    prisma.receipt.count(),
  ])

  const deliveryRate = totalDonations > 0
    ? Math.round((deliveredDonations / totalDonations) * 100)
    : 0

  return NextResponse.json({
    totalDonations,
    deliveredDonations,
    pendingDonations,
    cancelledDonations,
    totalFoods,
    totalUsers,
    totalReceipts,
    deliveryRate,
  })
}
