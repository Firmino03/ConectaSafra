'use client'
// src/app/dashboard/admin/relatorios/page.tsx
import { useEffect, useState } from 'react'
import { Loader2, TrendingUp, Download } from 'lucide-react'
import { BarChart, DonutChart } from '@/components/ui/BarChart'
import { foodCategoryLabel } from '@/lib/utils'

const CATEGORY_COLORS: Record<string, string> = {
  FRUTAS:    '#f59e0b',
  LEGUMES:   '#10b981',
  VERDURAS:  '#14b8a6',
  GRAOS:     '#f97316',
  LATICINIOS:'#3b82f6',
  OUTROS:    '#8b5cf6',
}

export default function RelatoriosPage() {
  const [loading, setLoading] = useState(true)
  const [monthly, setMonthly]   = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [producers, setProducers]   = useState<any[]>([])
  const [overview, setOverview]     = useState<any>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/reports?type=monthly').then(r => r.json()),
      fetch('/api/reports?type=categories').then(r => r.json()),
      fetch('/api/reports?type=top-producers').then(r => r.json()),
      fetch('/api/reports?type=overview').then(r => r.json()),
    ]).then(([m, c, p, o]) => {
      setMonthly(m)
      setCategories(c)
      setProducers(p)
      setOverview(o)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-96">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto" />
          <p className="text-sm text-gray-500">Gerando relatórios...</p>
        </div>
      </div>
    )
  }

  const monthlyBarData = monthly.map(m => ({
    label: m.label,
    value: m.total,
    color: 'bg-green-600',
  }))

  const deliveredBarData = monthly.map(m => ({
    label: m.label,
    value: m.delivered,
    color: 'bg-teal-500',
  }))

  const categoryDonut = categories.map((c: any) => ({
    label: foodCategoryLabel[c.category as any] || c.category,
    value: c.count,
    color: CATEGORY_COLORS[c.category] || '#9ca3af',
  }))

  return (
    <div className="p-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold text-gray-900">Relatórios</h1>
          <p className="text-gray-500 mt-1 text-sm">Análise completa da plataforma Conecta Safra</p>
        </div>
        <button className="btn-secondary flex items-center gap-2 text-sm">
          <Download className="w-4 h-4" /> Exportar dados
        </button>
      </div>

      {/* KPIs */}
      {overview && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total de doações', value: overview.totalDonations, sub: `${overview.deliveryRate}% entregues`, color: 'text-green-600 bg-green-50' },
            { label: 'Doações entregues', value: overview.deliveredDonations, sub: 'concluídas com sucesso', color: 'text-teal-600 bg-teal-50' },
            { label: 'Comprovantes emitidos', value: overview.totalReceipts, sub: 'ao total', color: 'text-blue-600 bg-blue-50' },
            { label: 'Taxa de entrega', value: `${overview.deliveryRate}%`, sub: 'das doações finalizadas', color: 'text-amber-600 bg-amber-50' },
          ].map(k => (
            <div key={k.label} className="stat-card">
              <div className={`text-3xl font-semibold ${k.color.split(' ')[0]} mb-1`}>{k.value}</div>
              <p className="text-sm font-medium text-gray-700">{k.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{k.sub}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Doações por mês */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display text-base font-semibold text-gray-900">Doações nos últimos 6 meses</h2>
              <p className="text-xs text-gray-400 mt-0.5">Total de solicitações por mês</p>
            </div>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <BarChart data={monthlyBarData} height={140} unit=" doações" />
        </div>

        {/* Entregues por mês */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display text-base font-semibold text-gray-900">Entregas concluídas</h2>
              <p className="text-xs text-gray-400 mt-0.5">Doações com status "Entregue" por mês</p>
            </div>
          </div>
          <BarChart data={deliveredBarData} height={140} unit=" entregas" />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Categorias */}
        <div className="card">
          <h2 className="font-display text-base font-semibold text-gray-900 mb-5">Alimentos mais doados por categoria</h2>
          {categoryDonut.length > 0 ? (
            <DonutChart
              segments={categoryDonut}
              total={categoryDonut.reduce((a, b) => a + b.value, 0)}
              centerLabel="itens"
            />
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">Nenhuma doação registrada ainda</p>
          )}
        </div>

        {/* Top produtores */}
        <div className="card">
          <h2 className="font-display text-base font-semibold text-gray-900 mb-4">Top produtores</h2>
          {producers.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Nenhum produtor cadastrado</p>
          ) : (
            <div className="space-y-3">
              {producers.slice(0, 7).map((p: any, i: number) => {
                const maxDonations = producers[0]?._count?.donations || 1
                const pct = (p._count.donations / maxDonations) * 100
                return (
                  <div key={p.id}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-400 w-4">{i + 1}</span>
                        <div>
                          <span className="font-medium text-gray-900">{p.name}</span>
                          {p.farmName && (
                            <span className="text-xs text-gray-400 ml-1">· {p.farmName}</span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 font-medium">{p._count.donations} doações</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Resumo de status */}
      {overview && (
        <div className="card">
          <h2 className="font-display text-base font-semibold text-gray-900 mb-4">Distribuição de status das doações</h2>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Pendentes', value: overview.pendingDonations, color: 'bg-amber-400', text: 'text-amber-800', bg: 'bg-amber-50' },
              { label: 'Confirmadas', value: overview.totalDonations - overview.pendingDonations - overview.deliveredDonations - overview.cancelledDonations, color: 'bg-blue-400', text: 'text-blue-800', bg: 'bg-blue-50' },
              { label: 'Entregues', value: overview.deliveredDonations, color: 'bg-green-500', text: 'text-green-800', bg: 'bg-green-50' },
              { label: 'Canceladas', value: overview.cancelledDonations, color: 'bg-red-400', text: 'text-red-800', bg: 'bg-red-50' },
            ].map(s => (
              <div key={s.label} className={`${s.bg} rounded-xl p-4 text-center`}>
                <p className={`text-2xl font-semibold ${s.text}`}>{s.value}</p>
                <p className={`text-xs font-medium ${s.text} mt-1 opacity-80`}>{s.label}</p>
                <div className={`mt-2 h-1 ${s.color} rounded-full mx-auto`}
                  style={{ width: overview.totalDonations > 0 ? `${Math.max((s.value / overview.totalDonations) * 100, 5)}%` : '0%' }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
