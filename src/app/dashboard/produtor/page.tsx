// src/app/dashboard/produtor/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { formatDate, formatRelative, donationStatusLabel, donationStatusColor, foodCategoryLabel, foodCategoryColor } from '@/lib/utils'
import Link from 'next/link'
import { Plus, Package, ClipboardList, TrendingUp, Truck } from 'lucide-react'

export const metadata = { title: 'Painel do Produtor' }

export default async function ProdutorDashboard() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'PRODUTOR') redirect('/login')

  const userId = session.user.id

  const [foods, donations, user] = await Promise.all([
    prisma.food.findMany({
      where: { producerId: userId, active: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.donation.findMany({
      where: { donorId: userId },
      orderBy: { createdAt: 'desc' },
      take: 6,
      include: {
        recipient: { select: { name: true, institution: true } },
        items: { include: { food: { select: { name: true } } } },
        receipt: { select: { code: true } },
      },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, farmName: true, farmAddress: true, phone: true },
    }),
  ])

  const stats = {
    totalFoods: await prisma.food.count({ where: { producerId: userId, active: true } }),
    totalDonations: await prisma.donation.count({ where: { donorId: userId } }),
    pending: await prisma.donation.count({ where: { donorId: userId, status: 'PENDENTE' } }),
    delivered: await prisma.donation.count({ where: { donorId: userId, status: 'ENTREGUE' } }),
  }

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold text-gray-900">
            Olá, {session.user.name.split(' ')[0]}! 👋
          </h1>
          {user?.farmName && (
            <p className="text-gray-500 mt-1 text-sm">{user.farmName} — {user.farmAddress}</p>
          )}
        </div>
        <Link href="/dashboard/produtor/foods/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Novo alimento
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Alimentos ativos', value: stats.totalFoods, icon: <Package className="w-4 h-4" />, color: 'text-green-600 bg-green-50' },
          { label: 'Total de doações', value: stats.totalDonations, icon: <ClipboardList className="w-4 h-4" />, color: 'text-blue-600 bg-blue-50' },
          { label: 'Pendentes', value: stats.pending, icon: <TrendingUp className="w-4 h-4" />, color: 'text-amber-600 bg-amber-50' },
          { label: 'Entregues', value: stats.delivered, icon: <Truck className="w-4 h-4" />, color: 'text-teal-600 bg-teal-50' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className={`w-8 h-8 rounded-lg ${s.color} flex items-center justify-center mb-3`}>{s.icon}</div>
            <p className="text-2xl font-semibold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Alimentos */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-base font-semibold text-gray-900">Meus alimentos</h2>
            <Link href="/dashboard/produtor/foods" className="text-xs text-green-700 font-medium hover:underline">Ver todos →</Link>
          </div>
          {foods.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Package className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Nenhum alimento cadastrado</p>
              <Link href="/dashboard/produtor/foods/new" className="text-xs text-green-700 mt-2 inline-block hover:underline">Cadastrar agora →</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {foods.map(food => (
                <div key={food.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{food.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${foodCategoryColor[food.category]}`}>
                      {foodCategoryLabel[food.category]}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{food.quantity} {food.unit}</p>
                    {food.expiresAt && (
                      <p className="text-xs text-gray-400">Vence {formatDate(food.expiresAt)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Doações recentes */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-base font-semibold text-gray-900">Doações recentes</h2>
            <Link href="/dashboard/produtor/donations" className="text-xs text-green-700 font-medium hover:underline">Ver todas →</Link>
          </div>
          {donations.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm">Nenhuma doação ainda</p>
            </div>
          ) : (
            <div className="space-y-3">
              {donations.map(d => (
                <div key={d.id} className="flex items-start justify-between py-2.5 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{d.recipient.name}</p>
                    <p className="text-xs text-gray-400">{d.recipient.institution || '—'}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatRelative(d.createdAt)}</p>
                  </div>
                  <span className={`badge ${donationStatusColor[d.status]} ml-2`}>
                    {donationStatusLabel[d.status]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
