'use client'
// src/app/dashboard/admin/users/new/page.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, UserPlus } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

const ROLES = [
  { value: 'PRODUTOR',    label: '🌱 Produtor Agrícola' },
  { value: 'BENEFICIARIO',label: '🎓 Beneficiário' },
  { value: 'ADMIN',       label: '⚙️ Administrador' },
]

export default function AdminNewUserPage() {
  const router = useRouter()
  const { success, error: toastError } = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', password: '123456', role: 'BENEFICIARIO',
    phone: '', cpf: '', institution: '', registration: '',
    farmName: '', farmAddress: '',
  })

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (res.ok) {
      success('Usuário criado!', `${form.name} foi adicionado à plataforma.`)
      router.push('/dashboard/admin/users')
      router.refresh()
    } else {
      toastError('Erro ao criar usuário', data.error || 'Verifique os dados e tente novamente')
    }
    setLoading(false)
  }

  return (
    <div className="p-8 animate-fade-in max-w-2xl">
      <div className="mb-8">
        <Link href="/dashboard/admin/users" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar aos usuários
        </Link>
        <h1 className="font-display text-3xl font-semibold text-gray-900">Novo usuário</h1>
        <p className="text-gray-500 mt-1 text-sm">Adicione um novo membro à plataforma Conecta Safra</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Perfil *</label>
          <div className="grid grid-cols-3 gap-2">
            {ROLES.map(r => (
              <button
                key={r.value}
                type="button"
                onClick={() => set('role', r.value)}
                className={`py-2.5 px-3 border rounded-xl text-sm transition-all text-left
                  ${form.role === r.value
                    ? 'border-green-600 bg-green-50 text-green-800 font-medium'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome completo *</label>
            <input className="input-base" value={form.name} onChange={e => set('name', e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
            <input type="email" className="input-base" value={form.email} onChange={e => set('email', e.target.value)} required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Senha inicial *</label>
            <input type="text" className="input-base" value={form.password} onChange={e => set('password', e.target.value)} required />
            <p className="text-xs text-gray-400 mt-1">O usuário poderá alterar depois</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefone</label>
            <input className="input-base" placeholder="(81) 99999-0000" value={form.phone} onChange={e => set('phone', e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">CPF</label>
          <input className="input-base" placeholder="000.000.000-00" value={form.cpf} onChange={e => set('cpf', e.target.value)} />
        </div>

        {form.role === 'PRODUTOR' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome da propriedade</label>
              <input className="input-base" value={form.farmName} onChange={e => set('farmName', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Endereço da propriedade</label>
              <input className="input-base" value={form.farmAddress} onChange={e => set('farmAddress', e.target.value)} />
            </div>
          </>
        )}

        {form.role === 'BENEFICIARIO' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Instituição de ensino</label>
              <input className="input-base" placeholder="UFPE, IFPE, UFRPE..." value={form.institution} onChange={e => set('institution', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Matrícula / SIAPE</label>
              <input className="input-base" value={form.registration} onChange={e => set('registration', e.target.value)} />
            </div>
          </>
        )}

        <div className="flex gap-3 pt-2">
          <Link href="/dashboard/admin/users" className="btn-secondary flex-1 text-center py-2.5">Cancelar</Link>
          <button type="submit" disabled={loading} className="btn-primary flex-1 py-2.5 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
            {loading ? 'Criando...' : 'Criar usuário'}
          </button>
        </div>
      </form>
    </div>
  )
}
