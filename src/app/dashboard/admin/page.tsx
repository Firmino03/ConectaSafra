// src/app/dashboard/admin/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { formatDate, formatRelative, donationStatusLabel, donationStatusColor } from '@/lib/utils'
import { Users, Package, ClipboardList, TrendingUp, Leaf, GraduationCap, ShieldCheck } from 'lucide-react'

export const metadata = { title: 'Painel Administrativo' }

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') redirect('/login')

  const [
    totalDonations, pendingDonations, confirmedDonations, deliveredDonations,
    totalFoods, totalUsers, totalProdutores, totalBeneficiarios,
    recentDonations,
  ] = await Promise.all([
    prisma.donation.count(),
    prisma.donation.count({ where: { status: 'PENDENTE' } }),
    prisma.donation.count({ where: { status: 'CONFIRMADA' } }),
    prisma.donation.count({ where: { status: 'ENTREGUE' } }),
    prisma.food.count({ where: { active: true } }),
    prisma.user.count({ where: { active: true } }),
    prisma.user.count({ where: { role: 'PRODUTOR', active: true } }),
    prisma.user.count({ where: { role: 'BENEFICIARIO', active: true } }),
    prisma.donation.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: {
        donor: { select: { name: true, farmName: true } },
        recipient: { select: { name: true, institution: true } },
        receipt: { select: { code: true } },
      },
    }),
  ])

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-gray-900">Painel Administrativo</h1>
        <p className="text-gray-500 mt-1 text-sm">Visão geral da plataforma Conecta Safra</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total de doações', value: totalDonations, icon: <ClipboardList className="w-4 h-4" />, color: 'text-green-600 bg-green-50' },
          { label: 'Pendentes', value: pendingDonations, icon: <TrendingUp className="w-4 h-4" />, color: 'text-amber-600 bg-amber-50' },
          { label: 'Alimentos ativos', value: totalFoods, icon: <Package className="w-4 h-4" />, color: 'text-teal-600 bg-teal-50' },
          { label: 'Usuários ativos', value: totalUsers, icon: <Users className="w-4 h-4" />, color: 'text-blue-600 bg-blue-50' },
        ].map(stat => (
          <div key={stat.label} className="stat-card">
            <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Status breakdown */}
        <div className="card">
          <h2 className="font-display text-base font-semibold text-gray-900 mb-4">Status das doações</h2>
          <div className="space-y-3">
            {[
              { label: 'Pendentes', count: pendingDonations, color: 'bg-amber-400', total: totalDonations },
              { label: 'Confirmadas', count: confirmedDonations, color: 'bg-blue-400', total: totalDonations },
              { label: 'Entregues', count: deliveredDonations, color: 'bg-green-500', total: totalDonations },
              { label: 'Canceladas', count: totalDonations - pendingDonations - confirmedDonations - deliveredDonations, color: 'bg-red-400', total: totalDonations },
            ].map(item => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-medium text-gray-900">{item.count}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all`}
                    style={{ width: item.total ? `${(item.count / item.total) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Users breakdown */}
        <div className="card">
          <h2 className="font-display text-base font-semibold text-gray-900 mb-4">Comunidade</h2>
          <div className="space-y-4">
            {[
              { icon: <Leaf className="w-4 h-4 text-green-600" />, bg: 'bg-green-50', label: 'Produtores', count: totalProdutores },
              { icon: <ShieldCheck className="w-4 h-4 text-amber-600" />, bg: 'bg-amber-50', label: 'Administradores', count: totalUsers - totalProdutores - totalBeneficiarios },
              { icon: <GraduationCap className="w-4 h-4 text-teal-600" />, bg: 'bg-teal-50', label: 'Beneficiários', count: totalBeneficiarios },
            ].map(u => (
              <div key={u.label} className="flex items-center gap-3">
                <div className={`w-9 h-9 ${u.bg} rounded-lg flex items-center justify-center`}>{u.icon}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{u.label}</p>
                </div>
                <p className="text-lg font-semibold text-gray-900">{u.count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="card">
          <h2 className="font-display text-base font-semibold text-gray-900 mb-4">Ações rápidas</h2>
          <div className="space-y-2">
            {[
              { href: '/dashboard/admin/donations', label: 'Ver doações pendentes', badge: pendingDonations },
              { href: '/dashboard/admin/users', label: 'Gerenciar usuários', badge: null },
              { href: '/dashboard/admin/foods', label: 'Ver alimentos', badge: null },
              { href: '/dashboard/admin/receipts', label: 'Comprovantes emitidos', badge: null },
            ].map(action => (
              <a
                key={action.href}
                href={action.href}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <span className="text-sm text-gray-700 group-hover:text-gray-900">{action.label}</span>
                {action.badge !== null && action.badge > 0 && (
                  <span className="badge bg-amber-50 text-amber-800 border-amber-100">{action.badge}</span>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Recent donations table */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-base font-semibold text-gray-900">Doações recentes</h2>
          <a href="/dashboard/admin/donations" className="text-xs text-green-700 font-medium hover:underline">Ver todas →</a>
        </div>
        <div className="overflow-x-auto -mx-5">
          <table className="table-base">
            <thead>
              <tr>
                <th>Produtor</th>
                <th>Beneficiário</th>
                <th>Status</th>
                <th>Comprovante</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {recentDonations.map(d => (
                <tr key={d.id}>
                  <td>
                    <p className="font-medium text-gray-900 text-sm">{d.donor.name}</p>
                    <p className="text-xs text-gray-400">{d.donor.farmName || '—'}</p>
                  </td>
                  <td>
                    <p className="text-sm">{d.recipient.name}</p>
                    <p className="text-xs text-gray-400">{d.recipient.institution || '—'}</p>
                  </td>
                  <td>
                    <span className={`badge ${donationStatusColor[d.status]}`}>
                      {donationStatusLabel[d.status]}
                    </span>
                  </td>
                  <td>
                    {d.receipt ? (
                      <a href={`/dashboard/admin/receipts/${d.receipt.code}`} className="text-xs text-green-700 font-mono hover:underline">
                        {d.receipt.code}
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="text-xs text-gray-500">{formatRelative(d.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
