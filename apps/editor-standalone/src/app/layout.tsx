import { EffectorNext } from '@effector/next'
import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import type { FC, ReactNode } from 'react'

import './index.css'

export const metadata: Metadata = {
  title: 'kepvox/editor',
}

const monoFont = JetBrains_Mono({
  subsets: ['latin'],
})

const RootLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <html lang="en" className="dark">
      <body className={monoFont.className}>
        <EffectorNext>{children}</EffectorNext>
      </body>
    </html>
  )
}

export default RootLayout
