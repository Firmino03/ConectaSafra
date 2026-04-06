// src/app/page.tsx
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Shield, Info, Mail, MapPin } from 'lucide-react'
import ImportanceCarousel from '@/components/home/ImportanceCarousel'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── NAV ── */}
      <nav className="flex items-center justify-between px-8 py-3 border-b border-green-800 bg-green-900 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Conecta Safra"
            width={64}
            height={64}
            className="object-contain"
          />
          <p className="hidden sm:block text-xs text-green-100 font-semibold">Do campo à comunidade</p>
        </div>

        <div className="hidden md:flex items-center gap-7">
          <a href="#como-funciona" className="text-sm text-green-100 hover:text-white transition-colors font-medium">Como funciona</a>
          <Link href="/perfis" className="text-sm text-green-100 hover:text-white transition-colors font-medium">Perfis de usuário</Link>
          <Link href="/quem-somos" className="text-sm text-green-100 hover:text-white transition-colors font-medium">Quem somos</Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login"    className="text-sm text-green-100 hover:text-white transition-colors px-3 py-2 font-medium">Entrar</Link>
          <Link href="/register" className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-900 text-sm font-semibold rounded-xl border border-green-200 hover:bg-white transition-colors duration-150">Cadastrar <ArrowRight className="w-3.5 h-3.5" /></Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="px-8 py-24 bg-[#F7FAF3]">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-800 text-xs font-semibold px-3 py-1.5 rounded-full border border-green-100 mb-8">
            <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse" />
            Plataforma de doação de alimentos — Pernambuco
          </div>

          <h1 className="font-display text-5xl md:text-6xl font-semibold text-gray-900 leading-tight mb-6">
            Conectando o campo às{' '}
            <em className="not-italic text-green-600">comunidades acadêmicas</em>
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl leading-relaxed mb-10 font-medium">
            O Conecta Safra facilita a doação de alimentos produzidos localmente para estudantes e
            servidores de instituições de ensino, promovendo alimentação de qualidade e acesso justo.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/register" className="btn-primary flex items-center gap-2 text-base px-6 py-3">
              Começar agora <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/login" className="btn-secondary flex items-center gap-2 text-base px-6 py-3">
              Já tenho conta
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-14 max-w-sm">
            {[
              { num: '3',    label: 'perfis de usuário' },
              { num: '6',    label: 'etapas no fluxo' },
              { num: '100%', label: 'gratuito' },
            ].map((s) => (
              <div key={s.label} className="stat-card text-center">
                <div className="text-2xl font-semibold text-green-600">{s.num}</div>
                <div className="text-xs text-gray-600 mt-0.5 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ImportanceCarousel />

      {/* ── COMO FUNCIONA ── */}
      <section id="como-funciona" className="px-8 py-20 bg-white">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold text-green-600 uppercase tracking-widest mb-2">Fluxo principal</p>
          <h2 className="font-display text-3xl font-semibold text-gray-900 mb-12">Como funciona a plataforma</h2>
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            {[
              { n: 1, title: 'Cadastro na plataforma',      desc: 'O beneficiário se registra informando dados pessoais e vínculo com a instituição de ensino.' },
              { n: 2, title: 'Solicitação de doação',        desc: 'O beneficiário navega pelos alimentos disponíveis e realiza uma solicitação de doação.' },
              { n: 3, title: 'Emissão de comprovante',       desc: 'O sistema gera automaticamente um comprovante com código único da doação solicitada.' },
              { n: 4, title: 'Confirmação pela plataforma',  desc: 'A equipe administrativa valida e confirma o recebimento da solicitação junto ao produtor.' },
              { n: 5, title: 'Recebimento dos alimentos',    desc: 'O beneficiário retira ou recebe os alimentos frescos conforme data agendada.' },
              { n: 6, title: 'Processo finalizado',          desc: 'A doação é registrada no histórico e o ciclo é concluído com sucesso.' },
            ].map((step, i) => (
              <div key={step.n} className={`flex items-start gap-4 px-6 py-5 hover:bg-gray-50/50 transition-colors ${i < 5 ? 'border-b border-gray-50' : ''}`}>
                <div className="w-8 h-8 min-w-8 rounded-full bg-green-50 border border-green-100 text-green-800 text-sm font-bold flex items-center justify-center">
                  {step.n}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">{step.title}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-8 py-20 bg-green-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-4xl font-semibold text-green-100 mb-4">
            Pronto para fazer parte da rede?
          </h2>
          <p className="text-green-300 text-lg mb-8 max-w-lg mx-auto font-medium">
            Cadastre-se como produtor, beneficiário ou acesse como administrador.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register" className="flex items-center gap-2 px-6 py-3 bg-green-100 text-green-900 font-semibold rounded-lg hover:bg-white transition-colors text-sm">
              Criar conta <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/login" className="flex items-center gap-2 px-6 py-3 border border-green-700 text-green-200 font-medium rounded-lg hover:bg-green-800 transition-colors text-sm">
              Fazer login
            </Link>
          </div>
        </div>
      </section>

      {/* ── RODAPÉ COMPLETO ── */}
      <footer className="bg-[#ECF8E9] text-green-900 border-t border-green-100">
        <div className="px-8 py-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">

          {/* Coluna 1 — Marca */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo.png"
                alt="Conecta Safra"
                width={60}
                height={60}
                className="object-contain"
              />
              <span className="font-display text-lg font-semibold text-green-900">Conecta Safra</span>
            </div>
            <p className="text-sm text-green-800/90 leading-relaxed mb-5">
              Conectando quem produz a quem precisa.
            </p>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-xs text-green-700">
                <MapPin className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                Pernambuco, Brasil
              </div>
              <div className="flex items-center gap-2 text-xs text-green-700">
                <Mail className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                contato@conectasafra.com.br
              </div>
            </div>
          </div>

          {/* Coluna 2 — Navegação */}
          <div>
            <h4 className="text-xs font-bold text-green-900 mb-4 uppercase tracking-widest">Plataforma</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/register',      label: 'Criar conta' },
                { href: '/login',         label: 'Fazer login' },
              ].map(l => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-green-700 hover:text-green-900 transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 3 — Sobre nós */}
          <div>
            <h4 className="text-xs font-bold text-green-900 mb-4 uppercase tracking-widest flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-green-600" /> Sobre nós
            </h4>
            <p className="text-sm text-green-700 leading-relaxed mb-4">
              As informações institucionais e os perfis de usuário estão disponíveis em uma página dedicada.
            </p>
            <Link href="/quem-somos" className="inline-flex items-center gap-1.5 text-xs text-green-800 font-semibold bg-green-100 border border-green-200 px-2.5 py-1 rounded-full hover:bg-green-200 transition-colors">
              Ver quem somos
            </Link>
          </div>

          {/* Coluna 4 — Privacidade & LGPD */}
          <div>
            <h4 className="text-xs font-bold text-green-900 mb-4 uppercase tracking-widest flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-green-600" /> Privacidade & LGPD
            </h4>
            <p className="text-sm text-green-700 leading-relaxed mb-3">
              O Conecta Safra respeita e cumpre integralmente a{' '}
              <strong className="text-green-900">Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD)</strong>.
            </p>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="border-t border-green-200 px-8 py-3 bg-[#E2F2DE]">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-green-800">
              © {new Date().getFullYear()} Conecta Safra — Todos os direitos reservados
            </p>
            <div className="flex items-center gap-5">
              <a href="#privacidade" className="text-xs text-green-800 hover:text-green-950 transition-colors">Política de Privacidade</a>
              <span className="text-green-500">·</span>
              <a href="#termos"      className="text-xs text-green-800 hover:text-green-950 transition-colors">Termos de Uso</a>
              <span className="text-green-500">·</span>
              <a href="mailto:contato@conectasafra.com.br" className="text-xs text-green-800 hover:text-green-950 transition-colors">Contato</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
