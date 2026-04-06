'use client'

import { useEffect, useState } from 'react'

const slides = [
  {
    title: 'Brasil investe valor recorde na agricultura familiar',
    description:
      'Mais de 1 milhão de contratos rurais já foram realizados no novo Plano Safra, ampliando o acesso ao crédito e incentivando a produção de alimentos essenciais e sustentáveis em todo o Brasil.',
    highlight: 'Economia rural forte, comunidade mais protegida.',
    badge: 'Agricultura familiar',
  },
  {
    title: 'Alimentação saudável reduz doenças crônicas',
    description:
      'Estudos mostram que dietas baseadas em alimentos naturais reduzem riscos de doenças como diabetes e hipertensão.',
    highlight: 'Mais saude no prato, mais qualidade de vida.',
    badge: 'Alimentacao saudavel',
  },
  {
    title: 'Agricultura orgânica ganha força contra fome e mudanças climáticas',
    description:
      'A agricultura orgânica vem sendo apontada como solução estratégica para combater a fome e reduzir impactos climáticos, fortalecendo a segurança alimentar e preservando a biodiversidade.',
    highlight: 'Menos desperdicio, mais impacto social.',
    badge: 'Sustentabilidade',
  },
  {
    title: 'R$ 40 milhões para doação de alimentos no Brasil',
    description:
      'O governo federal destinou R$ 40 milhões para compra de alimentos da agricultura familiar, que serão distribuídos a famílias em situação de vulnerabilidade em mais de 200 municípios.',
    highlight: 'Solidariedade com responsabilidade.',
    badge: 'Confianca e rastreio',
  },
]

export default function ImportanceCarousel() {
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length)
    }, 6000)

    return () => clearInterval(intervalId)
  }, [])

  const goToPrevious = () => {
    setActiveSlide((current) => (current - 1 + slides.length) % slides.length)
  }

  const goToNext = () => {
    setActiveSlide((current) => (current + 1) % slides.length)
  }

  return (
    <section className="px-8 py-16 bg-gradient-to-b from-[#EEF8EA] to-white border-y border-green-100">
      <div className="max-w-4xl mx-auto">
        <p className="text-xs font-semibold text-green-700 uppercase tracking-widest mb-2">Por que isso importa</p>
        <h2 className="font-display text-3xl font-semibold text-gray-900 mb-8">Agricultura, alimentos organicos e impacto social</h2>

        <div className="relative overflow-hidden rounded-2xl border border-green-100 bg-white shadow-sm">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${activeSlide * 100}%)` }}
          >
            {slides.map((slide) => (
              <article key={slide.title} className="w-full min-w-full p-8 md:p-10">
                <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-800">
                  {slide.badge}
                </span>
                <h3 className="mt-4 text-2xl font-semibold text-gray-900 leading-snug">{slide.title}</h3>
                <p className="mt-4 text-base text-gray-600 leading-relaxed">{slide.description}</p>
                <p className="mt-5 text-sm font-semibold text-green-700">{slide.highlight}</p>
              </article>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-green-100 bg-[#F5FBF3] px-5 py-4">
            <div className="flex items-center gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.title}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    activeSlide === index ? 'w-7 bg-green-600' : 'w-2.5 bg-green-200 hover:bg-green-300'
                  }`}
                  aria-label={`Ir para slide ${index + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goToPrevious}
                className="rounded-lg border border-green-200 bg-white px-3 py-1.5 text-sm font-medium text-green-800 hover:bg-green-50 transition-colors"
              >
                Anterior
              </button>
              <button
                type="button"
                onClick={goToNext}
                className="rounded-lg border border-green-200 bg-green-100 px-3 py-1.5 text-sm font-semibold text-green-900 hover:bg-green-200 transition-colors"
              >
                Proximo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
