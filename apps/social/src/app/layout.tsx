import { EffectorNext } from '@effector/next'
import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { JetBrains_Mono } from 'next/font/google'
import type { FC, ReactNode } from 'react'
import { ENV } from '#shared/env'

import './index.css'

export const metadata: Metadata = {
  title: 'kepvox/social',
}

const monoFont = JetBrains_Mono({
  subsets: ['latin'],
})

type Props = {
  children: ReactNode
  auth: ReactNode
}

const RootLayout: FC<Props> = props => {
  const { children, auth } = props

  return (
    <html lang="en" suppressHydrationWarning>
      <head>{ENV.NODE_ENV === 'development' && <script src="https://unpkg.com/react-scan/dist/auto.global.js" />}</head>
      <body className={monoFont.className}>
        <ThemeProvider defaultTheme="dark" attribute="class">
          <EffectorNext>
            {children}
            {auth}
          </EffectorNext>
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
