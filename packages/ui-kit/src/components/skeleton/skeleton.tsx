import type { OmitExisting } from '@repo/common/typing'
import type { ComponentProps, FC } from 'react'
import { cn } from '#lib/classnames'

type Props = OmitExisting<ComponentProps<'div'>, 'children'>

export const Skeleton: FC<Props> = ({ className, ...divProps }) => {
  return <div className={cn('animate-pulse rounded-md bg-muted', className)} {...divProps} />
}
