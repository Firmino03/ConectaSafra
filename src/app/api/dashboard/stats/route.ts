// src/app/api/dashboard/stats/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const role = session.user.role
  const userId = session.user.id

  if (role === 'ADMIN') {
    const [
      totalDonations, pendingDonations, confirmedDonations,
      deliveredDonations, totalFoods, totalUsers,
      totalProdutores, totalBeneficiarios,
    ] = await Promise.all([
      prisma.donation.count(),
      prisma.donation.count({ where: { status: 'PENDENTE' } }),
      prisma.donation.count({ where: { status: 'CONFIRMADA' } }),
      prisma.donation.count({ where: { status: 'ENTREGUE' } }),
      prisma.food.count({ where: { active: true } }),
      prisma.user.count({ where: { active: true } }),
      prisma.user.count({ where: { role: 'PRODUTOR', active: true } }),
      prisma.user.count({ where: { role: 'BENEFICIARIO', active: true } }),
    ])

    return NextResponse.json({
      totalDonations, pendingDonations, confirmedDonations,
      deliveredDonations, totalFoods, totalUsers,
      totalProdutores, totalBeneficiarios,
    })
  }

  if (role === 'PRODUTOR') {
    const [totalFoods, activeFoods, totalDonations, pendingDonations, deliveredDonations] = await Promise.all([
      prisma.food.count({ where: { producerId: userId } }),
      prisma.food.count({ where: { producerId: userId, active: true } }),
      prisma.donation.count({ where: { donorId: userId } }),
      prisma.donation.count({ where: { donorId: userId, status: 'PENDENTE' } }),
      prisma.donation.count({ where: { donorId: userId, status: 'ENTREGUE' } }),
    ])

    return NextResponse.json({ totalFoods, activeFoods, totalDonations, pendingDonations, deliveredDonations })
  }

  if (role === 'BENEFICIARIO') {
    const [totalDonations, pendingDonations, confirmedDonations, deliveredDonations] = await Promise.all([
      prisma.donation.count({ where: { recipientId: userId } }),
      prisma.donation.count({ where: { recipientId: userId, status: 'PENDENTE' } }),
      prisma.donation.count({ where: { recipientId: userId, status: 'CONFIRMADA' } }),
      prisma.donation.count({ where: { recipientId: userId, status: 'ENTREGUE' } }),
    ])

    return NextResponse.json({ totalDonations, pendingDonations, confirmedDonations, deliveredDonations })
  }

  return NextResponse.json({})
}
