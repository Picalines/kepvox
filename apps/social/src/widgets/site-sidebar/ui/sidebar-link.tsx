'use client'

import { Button } from '@repo/ui-kit/components/button'
import { Text } from '@repo/ui-kit/components/text'
import { Tooltip } from '@repo/ui-kit/components/tooltip'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { FC, ReactNode } from 'react'

type Props = {
  href: string
  icon: ReactNode
  children?: ReactNode
}

export const SidebarLink: FC<Props> = props => {
  const { href, icon, children } = props

  const pathname = usePathname()
  const isHighlighted = href !== '/' && pathname.startsWith(href)

  return (
    <Tooltip.Root>
      <Tooltip.Trigger>
        <Button asChild variant={isHighlighted ? 'secondary' : 'ghost'}>
          <Link href={href} prefetch={false}>
            {icon}
          </Link>
        </Button>
      </Tooltip.Trigger>
      {children && (
        <Tooltip.Content side="right" sideOffset={0}>
          <Text>{children}</Text>
        </Tooltip.Content>
      )}
      <Tooltip.Arrow />
    </Tooltip.Root>
  )
}
