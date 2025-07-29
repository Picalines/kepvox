'use client'

import { Button } from '@repo/ui-kit/components/button'
import { MoonIcon, SunIcon } from '@repo/ui-kit/icons'
import { useTheme } from 'next-themes'
import type { FC } from 'react'

type Props = Pick<Button.RootProps, 'variant' | 'size'>

export const ThemeSwitcher: FC<Props> = props => {
  const { setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme => (theme === 'light' ? 'dark' : 'light'))
  }

  return (
    <Button.Root {...props} onMouseDown={toggleTheme}>
      <Button.Icon icon={ThemeIcon} />
    </Button.Root>
  )
}

const ThemeIcon: FC = () => {
  return (
    <>
      <SunIcon className="block starting:rotate-90 transition-all dark:hidden" />
      <MoonIcon className="hidden starting:rotate-90 transition-all dark:block" />
    </>
  )
}
