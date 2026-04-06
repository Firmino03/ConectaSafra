// src/app/dashboard/admin/users/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { formatDate, getRoleLabel } from '@/lib/utils'
import { Users, Leaf, GraduationCap, ShieldCheck } from 'lucide-react'
import { ToggleUserButton } from '@/components/admin/ToggleUserButton'

export const metadata = { title: 'Usuários' }

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') redirect('/login')

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, name: true, email: true, role: true,
      phone: true, institution: true, farmName: true,
      active: true, createdAt: true,
      _count: { select: { donations: true, receipts: true } },
    },
  })

  const roleIcon: Record<string, React.ReactNode> = {
    ADMIN: <ShieldCheck className="w-3.5 h-3.5" />,
    PRODUTOR: <Leaf className="w-3.5 h-3.5" />,
    BENEFICIARIO: <GraduationCap className="w-3.5 h-3.5" />,
  }

  const roleClass: Record<string, string> = {
    ADMIN: 'bg-amber-50 text-amber-800 border-amber-100',
    PRODUTOR: 'bg-green-50 text-green-800 border-green-100',
    BENEFICIARIO: 'bg-teal-50 text-teal-800 border-teal-100',
  }

  return (
    <div className="p-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold text-gray-900">Usuários</h1>
          <p className="text-gray-500 mt-1 text-sm">{users.length} usuários cadastrados na plataforma</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Produtores', count: users.filter(u => u.role === 'PRODUTOR').length, icon: <Leaf className="w-4 h-4 text-green-600" />, bg: 'bg-green-50' },
          { label: 'Beneficiários', count: users.filter(u => u.role === 'BENEFICIARIO').length, icon: <GraduationCap className="w-4 h-4 text-teal-600" />, bg: 'bg-teal-50' },
          { label: 'Administradores', count: users.filter(u => u.role === 'ADMIN').length, icon: <ShieldCheck className="w-4 h-4 text-amber-600" />, bg: 'bg-amber-50' },
        ].map(s => (
          <div key={s.label} className="stat-card flex items-center gap-3">
            <div className={`w-9 h-9 ${s.bg} rounded-lg flex items-center justify-center`}>{s.icon}</div>
            <div>
              <p className="text-xl font-semibold text-gray-900">{s.count}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="table-base">
          <thead>
            <tr>
              <th>Usuário</th>
              <th>Perfil</th>
              <th>Contato / Vínculo</th>
              <th>Doações</th>
              <th>Cadastrado em</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-50 border border-green-100 flex items-center justify-center text-xs font-medium text-green-800">
                      {user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`badge ${roleClass[user.role]} gap-1`}>
                    {roleIcon[user.role]}
                    {getRoleLabel(user.role)}
                  </span>
                </td>
                <td>
                  <p className="text-sm text-gray-600">{user.phone || '—'}</p>
                  <p className="text-xs text-gray-400">{user.institution || user.farmName || '—'}</p>
                </td>
                <td className="text-sm text-gray-700">{(user._count as any).donations}</td>
                <td className="text-xs text-gray-500">{formatDate(user.createdAt)}</td>
                <td>
                  <span className={`badge ${user.active ? 'bg-green-50 text-green-800 border-green-100' : 'bg-red-50 text-red-800 border-red-100'}`}>
                    {user.active ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td>
                  <ToggleUserButton userId={user.id} active={user.active} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
