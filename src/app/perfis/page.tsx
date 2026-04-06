import Link from 'next/link'
import { ArrowLeft, GraduationCap, Leaf, ShieldCheck, Sparkles } from 'lucide-react'

const profiles = [
  {
    icon: <Leaf className="w-6 h-6 text-green-100" />,
    glow: 'from-green-700 to-green-900',
    tag: 'Doador',
    tagClass: 'bg-green-100 text-green-900 border-green-200',
    title: 'Produtor Agricola',
    desc: 'Cadastra e disponibiliza alimentos produzidos localmente para doacao as instituicoes de ensino, fortalecendo a economia rural.',
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-emerald-100" />,
    glow: 'from-emerald-700 to-emerald-900',
    tag: 'Gestor',
    tagClass: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    title: 'Equipe Administrativa',
    desc: 'Gerencia as doacoes, valida solicitacoes, confirma recebimentos e mantem a integridade do processo na plataforma.',
  },
  {
    icon: <GraduationCap className="w-6 h-6 text-lime-100" />,
    glow: 'from-lime-700 to-lime-900',
    tag: 'Beneficiario',
    tagClass: 'bg-lime-100 text-lime-900 border-lime-200',
    title: 'Estudante / Servidor',
    desc: 'Estudantes e servidores de instituicoes publicas de ensino que recebem alimentos frescos e de qualidade gratuitamente.',
  },
]

export default function PerfisPage() {
  return (
    <div className="min-h-screen bg-[#EEF6E8]">
      <section className="px-8 py-16 bg-gradient-to-br from-green-950 via-green-900 to-green-800 text-green-50">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-green-200 hover:text-white transition-colors mb-6 font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar para a pagina inicial
          </Link>
          <p className="text-xs font-semibold text-green-200 uppercase tracking-widest mb-2">Perfis de usuario</p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold leading-tight mb-4">
            Quem usa o Conecta Safra
          </h1>
          <p className="text-base text-green-100/90 max-w-3xl leading-relaxed font-medium">
            Cada perfil tem um papel essencial para garantir que os alimentos saiam do campo e cheguem com seguranca a quem precisa.
          </p>
        </div>
      </section>

      <section className="px-8 py-16">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <article
              key={profile.title}
              className="rounded-2xl border border-green-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-green-400"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${profile.glow} flex items-center justify-center mb-5 shadow-lg`}>
                {profile.icon}
              </div>
              <h2 className="font-display text-3xl font-semibold text-green-950 mb-3 leading-snug">{profile.title}</h2>
              <p className="text-base text-green-900/80 leading-relaxed mb-5">{profile.desc}</p>
              <span className={`badge ${profile.tagClass} font-semibold`}>{profile.tag}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="px-8 pb-16">
        <div className="max-w-5xl mx-auto rounded-2xl border border-green-200 bg-white/80 backdrop-blur p-6 md:p-8">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-green-700 mt-0.5" />
            <div>
              <h3 className="font-display text-2xl text-green-950 font-semibold mb-2">Fluxo integrado entre perfis</h3>
              <p className="text-sm md:text-base text-green-900/80 leading-relaxed">
                Produtores doam, a equipe administrativa valida e os beneficiarios recebem. Essa cadeia colaborativa e o que torna a plataforma eficiente e humana.
              </p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/quem-somos" className="inline-flex items-center px-4 py-2 rounded-lg bg-green-800 text-green-50 text-sm font-semibold hover:bg-green-900 transition-colors">
              Ver quem somos
            </Link>
            <Link href="/#como-funciona" className="inline-flex items-center px-4 py-2 rounded-lg border border-green-300 text-green-900 text-sm font-semibold hover:bg-green-100 transition-colors">
              Ver como funciona
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
