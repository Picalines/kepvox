'use client'

import { cn } from '@repo/ui-kit/classnames'
import { Button } from '@repo/ui-kit/components/button'
import { PlayIcon, SquareIcon } from '@repo/ui-kit/icons'
import { useUnit } from 'effector-react'
import { model } from '../model'

export const PlaybackButton = () => {
  const { status, toggled } = useUnit({
    status: model.$status,
    toggled: model.playbackToggled,
  })

  const disabled = status === 'initializing'

  const Icon = status === 'playing' ? SquareIcon : PlayIcon

  return (
    <Button onClick={toggled} size="md" shape="square" variant="secondary" className="relative" disabled={disabled}>
      <Icon className={cn('absolute', disabled && 'animate-pulse')} />
    </Button>
  )
}
