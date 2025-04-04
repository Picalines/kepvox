'use client'

import type { OmitExisting } from '@repo/common/typing'
import { Button } from '@repo/ui-kit/components/button'
import { MoonIcon, SunIcon } from '@repo/ui-kit/icons'
import { useTheme } from 'next-themes'
import type { ComponentProps, FC } from 'react'

type Props = OmitExisting<ComponentProps<typeof Button>, 'children' | 'onClick'>

export const ThemeSwitcher: FC<Props> = props => {
  const { className, ...buttonProps } = props

  const { setTheme, theme } = useTheme()

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light')

  return (
    <Button {...buttonProps} onClick={toggleTheme}>
      <div className="relative h-full w-full">
        <SunIcon className="absolute rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0" />
        <MoonIcon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </div>
    </Button>
  )
}
