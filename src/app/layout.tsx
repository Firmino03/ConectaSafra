// src/app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import { SessionProvider } from '@/components/providers/SessionProvider'
import { ToastProvider } from '@/components/ui/Toast'

export const metadata: Metadata = {
  title: {
    default: 'Conecta Safra',
    template: '%s | Conecta Safra',
  },
  description: 'Conectando produtores agrícolas às comunidades acadêmicas através de doações de alimentos.',
  keywords: ['doação', 'alimentos', 'agricultores', 'universidade', 'Pernambuco'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <SessionProvider>
          <ToastProvider>{children}</ToastProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
