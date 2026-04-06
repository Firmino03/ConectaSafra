import Link from 'next/link'
import { ArrowLeft, Leaf, ShieldCheck, Sprout } from 'lucide-react'

const values = [
  {
    icon: <Leaf className="w-6 h-6 text-green-100" />,
    title: 'Sustentabilidade',
    desc: 'Reduz o desperdicio de alimentos e fortalece a agricultura familiar local.',
    gradient: 'from-green-700 to-green-900',
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-emerald-100" />,
    title: 'Solidariedade',
    desc: 'Cria lacos entre o campo e a academia, humanizando a cadeia alimentar.',
    gradient: 'from-emerald-700 to-emerald-900',
  },
  {
    icon: <Sprout className="w-6 h-6 text-lime-100" />,
    title: 'Transparencia',
    desc: 'Todas as doacoes sao registradas, rastreadas e tem comprovante emitido.',
    gradient: 'from-lime-700 to-lime-900',
  },
  {
    icon: <Leaf className="w-6 h-6 text-teal-100" />,
    title: 'Acesso a alimentacao',
    desc: 'Garante que estudantes e servidores tenham acesso a alimentos frescos.',
    gradient: 'from-teal-700 to-teal-900',
  },
]

export default function QuemSomosPage() {
  return (
    <div className="min-h-screen bg-[#EAF3DE]">
      <section className="px-8 py-16 bg-gradient-to-br from-green-950 via-green-900 to-green-800 text-green-50">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-green-200 hover:text-white transition-colors mb-6 font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar para a pagina inicial
          </Link>
          <p className="text-xs font-semibold text-green-200 uppercase tracking-widest mb-2">Quem somos</p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold leading-tight mb-4">Nossa missao</h1>
          <p className="text-base text-green-100/90 max-w-3xl leading-relaxed font-medium">
            O Conecta Safra nasceu para criar uma ponte real entre quem produz no campo e quem precisa de acesso a alimentacao de qualidade.
          </p>
        </div>
      </section>

      <section className="px-8 py-16">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-start">
          <div className="rounded-2xl bg-white border border-green-200 p-7 shadow-sm">
            <p className="text-base text-green-900 leading-relaxed mb-4 font-medium">
            O Conecta Safra é uma plataforma digital desenvolvida para conectar produtores agrícolas da região ao Instituto Federal de Pernambuco (IFPE), facilitando a doação de alimentos produzidos localmente. A iniciativa tem como objetivo promover o aproveitamento solidário desses alimentos, direcionando-os à comunidade interna da instituição e às pessoas que vivem em seu entorno, fortalecendo a segurança alimentar e valorizando a produção agrícola regional.            </p>
            <p className="text-base text-green-900 leading-relaxed mb-4">
            Mais do que uma plataforma tecnológica, o Conecta Safra representa uma iniciativa de impacto social que fortalece o vínculo entre a instituição, os produtores locais e a comunidade.            </p>
            <p className="text-base text-green-900 leading-relaxed">
            O projeto evidencia o papel das instituições de ensino como agentes de transformação, promovendo ações que incentivam o engajamento comunitário e a construção de soluções sustentáveis para a sociedade.            </p>
          </div>

          <div className="space-y-4">
            {values.map((value) => (
              <article
                key={value.title}
                className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-green-200 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-green-400"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${value.gradient} flex items-center justify-center shrink-0`}>
                  {value.icon}
                </div>
                <div>
                  <h2 className="font-display text-2xl md:text-3xl font-semibold text-green-950 leading-tight mb-2">{value.title}</h2>
                  <p className="text-base text-green-900/80 leading-relaxed">{value.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-8 pb-16">
        <div className="max-w-5xl mx-auto rounded-2xl border border-green-200 bg-white p-6 md:p-8">
          <p className="text-sm text-green-800 mb-4">Quer conhecer os papeis da plataforma?</p>
          <Link href="/perfis" className="inline-flex items-center px-4 py-2 rounded-lg bg-green-800 text-green-50 text-sm font-semibold hover:bg-green-900 transition-colors">
            Ver perfis de usuario
          </Link>
        </div>
      </section>
    </div>
  )
}
