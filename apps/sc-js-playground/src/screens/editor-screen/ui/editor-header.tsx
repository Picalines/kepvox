import { Button } from '@repo/ui-kit/components/button'
import { Tooltip } from '@repo/ui-kit/components/tooltip'
import type { FC } from 'react'
import { ConnectionStatus } from './connection-status'
import { PlaybackButton } from './playback-button'

export const EditorHeader: FC = () => {
  return (
    <div className="flex w-full items-center gap-2 border-border border-b-2 p-2">
      <Tooltip>
        <Tooltip.Trigger asChild>
          <Button variant="secondary">sc-js playground</Button>
        </Tooltip.Trigger>
        <Tooltip.Content>TODO: about</Tooltip.Content>
        <Tooltip.Arrow />
      </Tooltip>
      <PlaybackButton />
      <ConnectionStatus />
    </div>
  )
}
