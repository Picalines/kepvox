'use client'

import { Heading } from '@repo/ui-kit/components/heading'
import { Tooltip } from '@repo/ui-kit/components/tooltip'
import type { FC } from 'react'
import { PlaybackButton } from './playback-button'

export const EditorHeader: FC = () => {
  return (
    <div className="flex w-full items-center gap-2 border-border border-b-2 p-2">
      <PlaybackButton />
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Heading.Root>
            <Heading.SuperTitle>@kepvox/synth</Heading.SuperTitle>
            <Heading.Description>Playground</Heading.Description>
          </Heading.Root>
        </Tooltip.Trigger>
        <Tooltip.Content>TODO: about</Tooltip.Content>
      </Tooltip.Root>
    </div>
  )
}
