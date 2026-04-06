'use client'
// src/app/register/page.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sprout, Loader2, ChevronRight } from 'lucide-react'

type Role = 'PRODUTOR' | 'BENEFICIARIO'

function onlyDigits(value: string) {
  return value.replace(/\D/g, '')
}

function formatPhone(value: string) {
  const digits = onlyDigits(value).slice(0, 11)
  if (digits.length <= 2) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

function formatCpf(value: string) {
  const digits = onlyDigits(value).slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}

function isValidCPF(value: string) {
  const cpf = onlyDigits(value)
  if (cpf.length !== 11) return false
  if (/^(\d)\1{10}$/.test(cpf)) return false

  let sum = 0
  for (let i = 0; i < 9; i++) sum += Number(cpf[i]) * (10 - i)
  let digit = (sum * 10) % 11
  if (digit === 10) digit = 0
  if (digit !== Number(cpf[9])) return false

  sum = 0
  for (let i = 0; i < 10; i++) sum += Number(cpf[i]) * (11 - i)
  digit = (sum * 10) % 11
  if (digit === 10) digit = 0

  return digit === Number(cpf[10])
}

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    cpf: '',
    role: '' as Role | '',
    // Produtor
    farmName: '',
    farmAddress: '',
    // Beneficiário
    institution: '',
    registration: '',
  })

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function validateStep1() {
    if (!form.role) return 'Selecione seu perfil'
    if (!form.name.trim()) return 'Informe seu nome'
    if (!form.email.trim()) return 'Informe seu email'
    if (!form.password || form.password.length < 6) return 'A senha deve ter pelo menos 6 caracteres'
    if (form.password !== form.confirmPassword) return 'As senhas não coincidem'
    return null
  }

  function validateStep2() {
    const phoneDigits = onlyDigits(form.phone)
    const cpfDigits = onlyDigits(form.cpf)

    if (!phoneDigits) return 'Informe o telefone'
    if (phoneDigits.length < 10 || phoneDigits.length > 11) return 'Telefone inválido'

    if (!cpfDigits) return 'Informe o CPF'
    if (!isValidCPF(form.cpf)) return 'CPF inválido'

    if (form.role === 'PRODUTOR') {
      if (!form.farmName.trim()) return 'Informe o nome da propriedade'
      if (!form.farmAddress.trim()) return 'Informe o endereço da propriedade'
    }

    if (form.role === 'BENEFICIARIO') {
      if (!form.institution.trim()) return 'Informe a instituição de ensino'
      if (!form.registration.trim()) return 'Informe a matrícula / SIAPE'
    }

    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (step === 1) {
      const err = validateStep1()
      if (err) { setError(err); return }
      setError('')
      setStep(2)
      return
    }

    const err = validateStep2()
    if (err) {
      setError(err)
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Erro ao criar conta')
        return
      }

      router.push('/login?registered=1')
    } catch {
      setError('Erro ao criar conta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7FAF3] flex items-center justify-center p-6">
      <div className="w-full max-w-lg animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Sprout className="w-6 h-6 text-green-100" />
          </div>
          <h1 className="font-display text-3xl font-semibold text-gray-900">Criar conta</h1>
          <p className="text-sm text-gray-500 mt-2">Faça parte da rede Conecta Safra</p>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full text-sm font-medium flex items-center justify-center transition-colors
                ${step >= s ? 'bg-green-600 text-green-100' : 'bg-gray-100 text-gray-400'}`}>
                {s}
              </div>
              {s < 2 && <div className={`h-px w-12 ${step > s ? 'bg-green-600' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="card">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-lg mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Você é:</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'PRODUTOR', label: 'Produtor Agrícola', icon: '🌱' },
                      { value: 'BENEFICIARIO', label: 'Beneficiário', icon: '🎓' },
                    ].map((r) => (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => set('role', r.value)}
                        className={`p-4 border rounded-xl text-left transition-all
                          ${form.role === r.value
                            ? 'border-green-600 bg-green-50 text-green-800'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                          }`}
                      >
                        <div className="text-2xl mb-2">{r.icon}</div>
                        <div className="text-sm font-medium">{r.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome completo</label>
                  <input className="input-base" placeholder="Seu nome" value={form.name} onChange={e => set('name', e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input type="email" className="input-base" placeholder="seu@email.com.br" value={form.email} onChange={e => set('email', e.target.value)} required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Senha</label>
                    <input type="password" className="input-base" placeholder="Min. 6 caracteres" value={form.password} onChange={e => set('password', e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmar senha</label>
                    <input type="password" className="input-base" placeholder="Repita a senha" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} required />
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefone</label>
                    <input
                      className="input-base"
                      placeholder="(81) 99999-0000"
                      value={form.phone}
                      onChange={e => set('phone', formatPhone(e.target.value))}
                      maxLength={15}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">CPF</label>
                    <input
                      className="input-base"
                      placeholder="000.000.000-00"
                      value={form.cpf}
                      onChange={e => set('cpf', formatCpf(e.target.value))}
                      maxLength={14}
                    />
                  </div>
                </div>

                {form.role === 'PRODUTOR' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome da propriedade</label>
                      <input className="input-base" placeholder="Fazenda / Sítio / Propriedade" value={form.farmName} onChange={e => set('farmName', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Endereço da propriedade</label>
                      <input className="input-base" placeholder="Estrada rural, município - PE" value={form.farmAddress} onChange={e => set('farmAddress', e.target.value)} />
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
                      <input className="input-base" placeholder="Número de matrícula" value={form.registration} onChange={e => set('registration', e.target.value)} />
                    </div>
                  </>
                )}
              </>
            )}

            <div className="flex gap-3 pt-2">
              {step > 1 && (
                <button type="button" onClick={() => setStep(1)} className="btn-secondary px-5">
                  Voltar
                </button>
              )}
              <button type="submit" disabled={loading} className="btn-primary flex-1 py-2.5 flex items-center justify-center gap-2">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {step === 1 ? (
                  <><span>Próximo</span> <ChevronRight className="w-4 h-4" /></>
                ) : (
                  loading ? 'Criando conta...' : 'Criar minha conta'
                )}
              </button>
            </div>
          </form>
        </div>

        <p className="text-sm text-center text-gray-500 mt-6">
          Já tem conta?{' '}
          <Link href="/login" className="text-green-700 font-medium hover:underline">Fazer login</Link>
        </p>
      </div>
    </div>
  )
}
