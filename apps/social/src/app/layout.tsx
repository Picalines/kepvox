import { EffectorNext } from '@effector/next'
import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { JetBrains_Mono } from 'next/font/google'
import type { FC, ReactNode } from 'react'

import './index.css'

export const metadata: Metadata = {
  title: 'kepvox/social',
}

const monoFont = JetBrains_Mono({
  subsets: ['latin'],
})

const RootLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={monoFont.className}>
        <ThemeProvider defaultTheme="dark" attribute="class">
          <EffectorNext>{children}</EffectorNext>
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
