import { ThemeProvider as NextThemeProvider } from 'next-themes'
import type { FC, ReactNode } from 'react'

// NOTE: despite the name, next-themes doesn't actually require next

type Props = {
  children: ReactNode
}

export type Theme = 'light' | 'dark'

const THEMES: Theme[] = ['light', 'dark']

export const ThemeProvider: FC<Props> = props => {
  const { children } = props

  return (
    <NextThemeProvider attribute="class" themes={THEMES} enableSystem>
      {children}
    </NextThemeProvider>
  )
}
