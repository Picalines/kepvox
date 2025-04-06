'use client'

import type { OmitExisting } from '@repo/common/typing'
import { Button } from '@repo/ui-kit/components/button'
import { MoonIcon, SunIcon } from '@repo/ui-kit/icons'
import { useTheme } from 'next-themes'
import type { ComponentProps, FC } from 'react'

type Props = OmitExisting<ComponentProps<typeof Button>, 'children' | 'onClick'>

export const ThemeSwitcher: FC<Props> = props => {
  const { setTheme, theme } = useTheme()

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light')

  return (
    <Button {...props} onClick={toggleTheme}>
      <svg role="graphics-symbol" className="transition-all dark:rotate-90">
        <SunIcon className="block dark:hidden" />
        <g className="-rotate-90 origin-center">
          <MoonIcon className="hidden dark:block" />
        </g>
      </svg>
    </Button>
  )
}
