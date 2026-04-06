'use client'
// src/app/dashboard/perfil/page.tsx
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, User } from 'lucide-react'
import { getRoleLabel } from '@/lib/utils'

export default function PerfilPage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    phone: '',
    farmName: '',
    farmAddress: '',
    institution: '',
    registration: '',
    password: '',
    confirmPassword: '',
  })

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/users/${session.user.id}`)
        .then(r => r.json())
        .then(data => {
          setForm(f => ({
            ...f,
            name: data.name || '',
            phone: data.phone || '',
            farmName: data.farmName || '',
            farmAddress: data.farmAddress || '',
            institution: data.institution || '',
            registration: data.registration || '',
          }))
        })
    }
  }, [session])

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.password && form.password !== form.confirmPassword) {
      setError('As senhas não coincidem')
      return
    }
    setLoading(true)
    setError('')

    const payload: any = {
      name: form.name,
      phone: form.phone,
      farmName: form.farmName,
      farmAddress: form.farmAddress,
      institution: form.institution,
      registration: form.registration,
    }
    if (form.password) payload.password = form.password

    const res = await fetch(`/api/users/${session?.user?.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      setSuccess(true)
      await update({ name: form.name })
      router.refresh()
      setTimeout(() => setSuccess(false), 3000)
    } else {
      const data = await res.json()
      setError(data.error || 'Erro ao atualizar perfil')
    }
    setLoading(false)
  }

  if (!session) return null
  const role = session.user.role
  const initials = session.user.name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className="p-8 animate-fade-in max-w-2xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-gray-900">Meu perfil</h1>
        <p className="text-gray-500 mt-1 text-sm">Gerencie suas informações pessoais</p>
      </div>

      {/* Avatar card */}
      <div className="card flex items-center gap-5 mb-6">
        <div className="w-16 h-16 rounded-2xl bg-green-50 border-2 border-green-100 flex items-center justify-center text-xl font-semibold text-green-800">
          {initials}
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-lg">{session.user.name}</p>
          <p className="text-sm text-gray-500">{session.user.email}</p>
          <span className="badge bg-green-50 text-green-800 border-green-100 mt-1">
            {getRoleLabel(role)}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4">
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-3 rounded-lg">
            ✅ Perfil atualizado com sucesso!
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome completo</label>
          <input className="input-base" value={form.name} onChange={e => set('name', e.target.value)} required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefone</label>
          <input className="input-base" placeholder="(81) 99999-0000" value={form.phone} onChange={e => set('phone', e.target.value)} />
        </div>

        {role === 'PRODUTOR' && (
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

        {role === 'BENEFICIARIO' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Instituição de ensino</label>
              <input className="input-base" value={form.institution} onChange={e => set('institution', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Matrícula / SIAPE</label>
              <input className="input-base" value={form.registration} onChange={e => set('registration', e.target.value)} />
            </div>
          </>
        )}

        <hr className="border-gray-100" />
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Alterar senha (opcional)</p>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nova senha</label>
            <input type="password" className="input-base" placeholder="Min. 6 caracteres" value={form.password} onChange={e => set('password', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmar senha</label>
            <input type="password" className="input-base" placeholder="Repita a senha" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 flex items-center justify-center gap-2 mt-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {loading ? 'Salvando...' : 'Salvar alterações'}
        </button>
      </form>
    </div>
  )
}
