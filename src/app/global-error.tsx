'use client'

export default function GlobalError() {
  return (
    <html lang="pt-BR">
      <body>
        <div className="min-h-screen bg-[#F7FAF3] flex items-center justify-center px-6">
          <div className="max-w-lg w-full bg-white border border-red-100 rounded-2xl p-8 text-center">
            <h2 className="font-display text-3xl text-red-700 mb-3">Erro critico da aplicacao</h2>
            <p className="text-sm text-gray-600">
              Nao foi possivel renderizar a interface no momento.
            </p>
          </div>
        </div>
      </body>
    </html>
  )
}
