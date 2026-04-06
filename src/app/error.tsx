'use client'

type ErrorPageProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="min-h-screen bg-[#F7FAF3] flex items-center justify-center px-6">
      <div className="max-w-lg w-full bg-white border border-green-100 rounded-2xl p-8 text-center">
        <h2 className="font-display text-3xl text-green-900 mb-3">Algo deu errado</h2>
        <p className="text-sm text-gray-600 mb-6">
          Ocorreu um erro inesperado ao carregar esta pagina. Tente novamente.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="px-4 py-2 rounded-lg bg-green-700 text-green-50 text-sm font-semibold hover:bg-green-800 transition-colors"
        >
          Tentar novamente
        </button>
        {error?.digest ? (
          <p className="text-xs text-gray-400 mt-4">Referencia: {error.digest}</p>
        ) : null}
      </div>
    </div>
  )
}
