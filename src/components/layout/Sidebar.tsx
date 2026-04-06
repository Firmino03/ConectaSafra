'use client'
// src/components/layout/Sidebar.tsx
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard, Package, ClipboardList,
  Users, FileText, LogOut, ChevronRight, Settings, TrendingUp,
} from 'lucide-react'
import { cn, getRoleLabel } from '@/lib/utils'

interface SidebarProps {
  user: { id: string; name: string; email: string; role: string }
}

const navByRole: Record<string, { href: string; label: string; icon: React.ReactNode }[]> = {
  ADMIN: [
    { href: '/dashboard/admin', label: 'Visão geral', icon: <LayoutDashboard className="w-4 h-4" /> },
    { href: '/dashboard/admin/donations', label: 'Doações', icon: <ClipboardList className="w-4 h-4" /> },
    { href: '/dashboard/admin/foods', label: 'Alimentos', icon: <Package className="w-4 h-4" /> },
    { href: '/dashboard/admin/users', label: 'Usuários', icon: <Users className="w-4 h-4" /> },
    { href: '/dashboard/admin/receipts', label: 'Comprovantes', icon: <FileText className="w-4 h-4" /> },
    { href: '/dashboard/admin/relatorios', label: 'Relatórios', icon: <TrendingUp className="w-4 h-4" /> },
  ],
  PRODUTOR: [
    { href: '/dashboard/produtor', label: 'Visão geral', icon: <LayoutDashboard className="w-4 h-4" /> },
    { href: '/dashboard/produtor/foods', label: 'Meus alimentos', icon: <Package className="w-4 h-4" /> },
    { href: '/dashboard/produtor/donations', label: 'Doações', icon: <ClipboardList className="w-4 h-4" /> },
  ],
  BENEFICIARIO: [
    { href: '/dashboard/beneficiario', label: 'Visão geral', icon: <LayoutDashboard className="w-4 h-4" /> },
    { href: '/dashboard/beneficiario/foods', label: 'Alimentos disponíveis', icon: <Package className="w-4 h-4" /> },
    { href: '/dashboard/beneficiario/donations', label: 'Minhas doações', icon: <ClipboardList className="w-4 h-4" /> },
    { href: '/dashboard/beneficiario/receipts', label: 'Comprovantes', icon: <FileText className="w-4 h-4" /> },
  ],
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const links = navByRole[user.role] || []
  const initials = user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()

  return (
    <aside className="w-60 min-w-60 h-full bg-gradient-to-b from-[#F4FAEF] via-[#EEF6E8] to-[#E8F1E3] border-r border-green-200/80 flex flex-col shadow-[inset_-1px_0_0_rgba(59,109,17,0.08)]">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-green-200/80 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="Conecta Safra"
            width={48}
            height={48}
            className="object-contain flex-shrink-0"
          />
          <div>
            <p className="font-display text-base font-semibold text-green-950 leading-none">Conecta Safra</p>
            <p className="text-[10px] text-green-700 font-semibold mt-0.5">Do campo à comunidade</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-[10px] font-semibold text-green-700/70 uppercase tracking-widest px-3 mb-2">
          {getRoleLabel(user.role)}
        </p>
        {links.map(link => {
          const active = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href + '/'))
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'sidebar-link border border-transparent hover:bg-green-100/80 hover:border-green-200 hover:text-green-900 hover:-translate-y-0.5',
                active && 'active bg-gradient-to-r from-green-200 to-green-100 border-green-300 text-green-900 shadow-sm'
              )}
            >
              {link.icon}
              <span className="flex-1">{link.label}</span>
              {active && <ChevronRight className="w-3 h-3 opacity-70" />}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-green-200/80 space-y-1 bg-white/30">
        <Link href="/dashboard/perfil" className="sidebar-link hover:bg-green-100/80 hover:border hover:border-green-200 hover:-translate-y-0.5">
          <Settings className="w-4 h-4" />
          <span>Perfil</span>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="sidebar-link w-full text-red-500 hover:bg-red-50 hover:text-red-700 hover:border hover:border-red-100"
        >
          <LogOut className="w-4 h-4" />
          <span>Sair</span>
        </button>
        <div className="flex items-center gap-3 px-3 py-3 mt-1 rounded-xl border border-green-200 bg-white/70 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-100 to-green-200 border border-green-300 flex items-center justify-center text-xs font-semibold text-green-900">
            {initials}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-green-950 truncate">{user.name}</p>
            <p className="text-[10px] text-green-700/70 truncate">{user.email}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
