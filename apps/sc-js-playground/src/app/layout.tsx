import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import '@repo/ui-kit/style.css'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'sc-js-playground',
}

const monoFont = JetBrains_Mono({
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <Script src="sc-synth/osc.min.js" />
      <Script src="sc-synth/scsynth.js" async />
      <body className={monoFont.className}>{children}</body>
    </html>
  )
}
