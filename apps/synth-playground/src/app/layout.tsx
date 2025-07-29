import { EffectorNext } from '@effector/next'
import { ThemeProvider } from '@repo/ui-kit/components/theme'
import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import type { FC, ReactNode } from 'react'

import './index.css'

export const metadata: Metadata = {
  title: 'kepvox/synth playground',
}

const monoFont = JetBrains_Mono({
  subsets: ['latin'],
})

const RootLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={monoFont.className}>
        <ThemeProvider>
          <EffectorNext>{children}</EffectorNext>
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
