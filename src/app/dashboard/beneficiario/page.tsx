// src/app/dashboard/beneficiario/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatRelative, donationStatusLabel, donationStatusColor } from '@/lib/utils'
import { Package, ClipboardList, FileText, Truck, ArrowRight } from 'lucide-react'

export const metadata = { title: 'Painel do Beneficiário' }

export default async function BeneficiarioDashboard() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'BENEFICIARIO') redirect('/login')

  const userId = session.user.id

  const [donations, availableFoods, user] = await Promise.all([
    prisma.donation.findMany({
      where: { recipientId: userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        donor: { select: { name: true, farmName: true } },
        items: { include: { food: { select: { name: true } } } },
        receipt: { select: { code: true } },
      },
    }),
    prisma.food.count({ where: { active: true } }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, institution: true, registration: true },
    }),
  ])

  const stats = {
    total: await prisma.donation.count({ where: { recipientId: userId } }),
    pending: await prisma.donation.count({ where: { recipientId: userId, status: 'PENDENTE' } }),
    confirmed: await prisma.donation.count({ where: { recipientId: userId, status: 'CONFIRMADA' } }),
    delivered: await prisma.donation.count({ where: { recipientId: userId, status: 'ENTREGUE' } }),
  }

  return (
    <div className="p-8 animate-fade-in bg-gradient-to-b from-[#EFF6E9] via-[#F7FAF3] to-[#EEF7E8] min-h-full">
      {/* Header */}
      <div className="rounded-2xl border border-green-800/20 bg-gradient-to-r from-green-950 via-green-900 to-green-800 px-6 py-5 mb-8 shadow-lg shadow-green-900/10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-semibold text-green-50 tracking-tight">
              Olá, {session.user.name.split(' ')[0]}! 👋
            </h1>
            {user?.institution && (
              <p className="text-green-200 mt-1 text-sm">
                {user.institution}
                {user.registration && ` · Matrícula: ${user.registration}`}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-transparent text-green-100 font-semibold text-sm border border-green-600/60 hover:bg-green-800/60 hover:text-white hover:-translate-y-0.5 transition-all"
            >
              Voltar para início
            </Link>
            <Link
              href="/dashboard/beneficiario/foods"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-100 text-green-950 font-semibold text-sm border border-green-200 hover:bg-white hover:-translate-y-0.5 transition-all"
            >
              <Package className="w-4 h-4" /> Solicitar doação
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total de doações', value: stats.total, icon: <ClipboardList className="w-4 h-4" />, color: 'text-green-100 bg-green-800' },
          { label: 'Pendentes', value: stats.pending, icon: <Package className="w-4 h-4" />, color: 'text-lime-100 bg-lime-800' },
          { label: 'Confirmadas', value: stats.confirmed, icon: <FileText className="w-4 h-4" />, color: 'text-emerald-100 bg-emerald-800' },
          { label: 'Entregues', value: stats.delivered, icon: <Truck className="w-4 h-4" />, color: 'text-teal-100 bg-teal-800' },
        ].map(s => (
          <div key={s.label} className="stat-card border-green-200/70 bg-white hover:-translate-y-1 hover:shadow-lg hover:shadow-green-900/10 transition-all duration-300">
            <div className={`w-8 h-8 rounded-lg ${s.color} flex items-center justify-center mb-3`}>{s.icon}</div>
            <p className="text-2xl font-semibold text-green-950">{s.value}</p>
            <p className="text-xs text-green-800/70 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* CTA Card */}
        <div className="card bg-gradient-to-br from-green-950 via-green-900 to-green-800 text-white border-green-800 flex flex-col justify-between shadow-xl shadow-green-900/20 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
          <div>
            <div className="w-10 h-10 bg-green-700 rounded-xl flex items-center justify-center mb-4 ring-1 ring-green-500/40">
              <Package className="w-5 h-5 text-green-200" />
            </div>
            <h3 className="font-display text-lg font-semibold !text-green-50 mb-2 drop-shadow-sm">
              {availableFoods} alimento{availableFoods !== 1 ? 's' : ''} disponíve{availableFoods !== 1 ? 'is' : 'l'}
            </h3>
            <p className="text-sm text-green-100/95 leading-relaxed">
              Produtores locais têm alimentos frescos disponíveis para doação agora.
            </p>
          </div>
          <Link
            href="/dashboard/beneficiario/foods"
            className="mt-6 flex items-center gap-2 text-sm font-semibold text-green-100 hover:text-white transition-colors"
          >
            Ver alimentos disponíveis <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Doações recentes */}
        <div className="card lg:col-span-2 border-green-200/70 bg-white/90 backdrop-blur hover:shadow-lg hover:shadow-green-900/10 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-base font-semibold text-gray-900">Minhas doações recentes</h2>
            <Link href="/dashboard/beneficiario/donations" className="text-xs text-green-700 font-medium hover:underline">
              Ver todas →
            </Link>
          </div>
          {donations.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <ClipboardList className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Nenhuma doação ainda</p>
              <Link href="/dashboard/beneficiario/foods" className="text-xs text-green-700 mt-2 inline-block hover:underline">
                Solicitar primeira doação →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {donations.map(d => (
                <div key={d.id} className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-green-50/70 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {d.items.map(i => i.food.name).join(', ')}
                    </p>
                    <p className="text-xs text-gray-400">
                      {d.donor.farmName || d.donor.name} · {formatRelative(d.createdAt)}
                    </p>
                    {d.receipt && (
                      <Link
                        href={`/dashboard/beneficiario/receipts/${d.receipt.code}`}
                        className="text-xs text-green-700 font-mono hover:underline"
                      >
                        {d.receipt.code}
                      </Link>
                    )}
                  </div>
                  <span className={`badge ${donationStatusColor[d.status]} ml-3 whitespace-nowrap`}>
                    {donationStatusLabel[d.status]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {[
          { step: '1', title: 'Escolha os alimentos', desc: 'Navegue pelos alimentos disponíveis de produtores locais', href: '/dashboard/beneficiario/foods' },
          { step: '2', title: 'Solicite a doação', desc: 'Faça sua solicitação e receba um comprovante automaticamente', href: '/dashboard/beneficiario/donations' },
          { step: '3', title: 'Retire os alimentos', desc: 'Após confirmação, retire os alimentos no local indicado', href: '/dashboard/beneficiario/receipts' },
        ].map(card => (
          <Link
            key={card.step}
            href={card.href}
            className="card border-green-200/70 bg-white hover:border-green-400 hover:shadow-xl hover:shadow-green-900/10 hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-green-800 to-green-950 text-green-100 border border-green-700 rounded-full text-xs font-semibold flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              {card.step}
            </div>
            <h3 className="text-sm font-semibold text-green-950 mb-1 group-hover:text-green-700 transition-colors">{card.title}</h3>
            <p className="text-xs text-green-900/70 leading-relaxed">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
