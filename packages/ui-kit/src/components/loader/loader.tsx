import type { FC } from 'react'
import { LoaderIcon } from '#icons'
import { cn } from '#lib/classnames'

export type LoaderProps = {
  className?: string
  centered?: boolean
}

export const Loader: FC<LoaderProps> = ({ className, centered = false }) => {
  const icon = <LoaderIcon className="animate-spin" />

  return (
    <div className={cn('w-min', className)}>
      {centered ? <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2">{icon}</div> : icon}
    </div>
  )
}
