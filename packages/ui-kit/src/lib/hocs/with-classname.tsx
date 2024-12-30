import type { FC } from 'react'
import { cn } from '#lib/classnames'

export function withClassName<P extends { className?: string } = {}>(
  Component: FC<P>,
  ...cnParams: Parameters<typeof cn>
): FC<P> {
  return props => <Component {...props} className={cn(...cnParams, props.className)} />
}
