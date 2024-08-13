import './globals.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { Header } from '@/components/header'
import { Toaster } from '@/components/ui/toaster'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sorteio | Ioio lanches',
  description: 'Resgate seu cupom de para partipar do sorteio',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-br" className="dark">
      <head>
        <link rel="shortcut icon" href="ioio-favicon.png" type="image/x-icon" />
      </head>
      <body
        className={cn(
          'flex min-h-screen flex-col bg-custom-background text-zinc-50',
          inter.className,
        )}
      >
        <Header />
        {children}
        <Toaster />
      </body>
    </html>
  )
}
