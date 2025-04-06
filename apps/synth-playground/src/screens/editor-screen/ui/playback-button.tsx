'use client'

import { Button } from '@repo/ui-kit/components/button'
import { Text } from '@repo/ui-kit/components/text'
import { Tooltip } from '@repo/ui-kit/components/tooltip'
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
    <Tooltip.Root>
      <Tooltip.Trigger>
        <Button
          onMouseDown={toggled}
          size="lg"
          variant={status === 'playing' ? 'destructive' : 'outline'}
          className="relative"
          disabled={disabled}
        >
          <Icon className={disabled ? 'animate-pulse' : ''} />
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>
        <Text>
          <kbd>
            <kbd>ctrl/cmd</kbd> + <kbd>enter</kbd>
          </kbd>
        </Text>
      </Tooltip.Content>
    </Tooltip.Root>
  )
}
