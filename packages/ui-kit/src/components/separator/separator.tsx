import * as RadixSeparator from '@radix-ui/react-separator'
import type { Overlay } from '@repo/common/typing'
import type { ComponentProps, FC } from 'react'
import { cn } from '#lib/classnames'

export type SeparatorProps = Overlay<
  ComponentProps<'div'>,
  {
    orientation?: 'horizontal' | 'vertical'
    decorative?: boolean
  }
>

export const Separator: FC<SeparatorProps> = ({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}) => (
  <RadixSeparator.Root
    {...props}
    decorative={decorative}
    orientation={orientation}
    className={cn('shrink-0 bg-border', orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]', className)}
  />
)
