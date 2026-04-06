'use client'
// src/app/login/page.tsx
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { getRoleDashboard } from '@/lib/utils'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const errorMsg = searchParams.get('error')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      })

      if (res?.error) {
        setError('Email ou senha inválidos.')
        return
      }

      // Buscar sessão para redirecionar ao dashboard correto
      const session = await fetch('/api/auth/session').then(r => r.json())
      const role = session?.user?.role
      router.push(getRoleDashboard(role))
      router.refresh()
    } catch {
      setError('Erro ao fazer login. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7FAF3] flex">
      {/* Painel esquerdo */}
      <div className="hidden lg:flex lg:w-1/2 bg-green-900 flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Conecta Safra" width={56} height={56} className="object-contain brightness-0 invert opacity-90" />
          <span className="font-display text-xl font-semibold text-green-100">Conecta Safra</span>
        </div>
        <div>
          <blockquote className="font-display text-3xl font-medium text-green-100 leading-snug mb-6">
            "Cada doação é uma semente de esperança plantada na vida de quem mais precisa."
          </blockquote>
          <p className="text-green-300 text-sm">Do campo às comunidades acadêmicas de Pernambuco</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[['Produtores', 'ativos'], ['Doações', 'realizadas'], ['Instituições', 'parceiras']].map(([n, l]) => (
            <div key={n} className="bg-green-800/50 rounded-xl p-4">
              <p className="font-display text-xl text-green-100 font-semibold">—</p>
              <p className="text-xs text-green-300 mt-1">{n} {l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Painel direito */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Image src="/logo.png" alt="Conecta Safra" width={48} height={48} className="object-contain" />
            <span className="font-display text-lg font-semibold text-gray-900">Conecta Safra</span>
          </div>

          <h1 className="font-display text-3xl font-semibold text-gray-900 mb-2">Bem-vindo de volta</h1>
          <p className="text-sm text-gray-500 mb-8">Entre com seu email e senha para acessar a plataforma.</p>

          {(error || errorMsg) && (
            <div className="bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-lg mb-6">
              {error || 'Acesso negado. Verifique suas credenciais.'}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                className="input-base"
                placeholder="seu@email.com.br"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">Senha</label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-base pr-10"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 flex items-center justify-center gap-2 mt-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Entrando...' : 'Entrar na plataforma'}
            </button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-6">
            Não tem conta?{' '}
            <Link href="/register" className="text-green-700 font-medium hover:underline">Cadastre-se</Link>
          </p>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-xs font-medium text-gray-500 mb-2">Contas de demonstração:</p>
            <div className="space-y-1">
              {[
                ['Admin', 'admin@conectasafra.com.br'],
                ['Produtor', 'joao@fazendabonsventos.com.br'],
                ['Beneficiário', 'ana.ferreira@ufpe.br'],
              ].map(([role, email]) => (
                <button
                  key={email}
                  onClick={() => setForm({ email, password: '123456' })}
                  className="w-full text-left text-xs px-3 py-1.5 rounded hover:bg-gray-100 transition-colors text-gray-600"
                >
                  <span className="font-medium">{role}:</span> {email}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
