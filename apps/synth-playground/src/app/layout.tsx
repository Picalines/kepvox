import { EffectorNext } from '@effector/next'
import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import type { ReactNode } from 'react'

import './index.css'

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
      <body className={monoFont.className}>
        <EffectorNext>{children}</EffectorNext>
      </body>
    </html>
  )
}
