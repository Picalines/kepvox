'use client'

import { useTheme } from 'next-themes'
import { type FC, type ReactNode, useEffect, useState } from 'react'
import type { Theme } from './theme-provider'

type Props = {
  children: (theme: Theme) => ReactNode
  fallback?: ReactNode
}

/**
 * Renders the children when a theme name becomes available. Acts more
 * as an escape hatch when you can't rely on CSS styling
 */
export const Themed: FC<Props> = props => {
  const { children, fallback = null } = props

  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted || !theme) {
    return fallback
  }

  return children(theme as Theme)
}
