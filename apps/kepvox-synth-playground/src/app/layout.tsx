import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import '@repo/ui-kit/style.css'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'kepvox/synth playground',
}

const monoFont = JetBrains_Mono({
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={monoFont.className}>{children}</body>
    </html>
  )
}
