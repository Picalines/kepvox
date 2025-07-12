import type { FC } from 'react'
import { LoaderIcon } from '#icons'

export type LoaderProps = {
  centered?: boolean
}

export const Loader: FC<LoaderProps> = props => {
  const { centered = false } = props

  const icon = <LoaderIcon className="animate-spin" />

  return (
    <div className="w-min">
      {centered ? <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2">{icon}</div> : icon}
    </div>
  )
}
