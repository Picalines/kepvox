import * as RadixSeparator from '@radix-ui/react-separator'
import type { FC } from 'react'
import { cn } from '#lib/classnames'

export type SeparatorProps = {
  orientation?: 'horizontal' | 'vertical'
  decorative?: boolean
}

export const Separator: FC<SeparatorProps> = props => {
  const { orientation = 'horizontal', decorative = true, ...rootProps } = props

  return (
    <RadixSeparator.Root
      {...rootProps}
      decorative={decorative}
      orientation={orientation}
      className={cn('shrink-0 bg-border', orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]')}
    />
  )
}
