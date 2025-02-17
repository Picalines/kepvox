import { Heading } from '@repo/ui-kit/components/heading'
import { Separator } from '@repo/ui-kit/components/separator'
import { Tooltip } from '@repo/ui-kit/components/tooltip'
import type { FC } from 'react'
import { EditorStatus } from './editor-status'
import { ExampleSelect } from './example-select'
import { PlaybackButton } from './playback-button'

export const EditorHeader: FC = () => {
  return (
    <div className="flex w-full items-center gap-2 border-b-2 p-2">
      <Tooltip.Root>
        <Tooltip.Trigger>
          <Heading.Root>
            <Heading.SuperTitle>@kepvox/synth</Heading.SuperTitle>
            <Heading.Title variant="text-m">Playground</Heading.Title>
          </Heading.Root>
        </Tooltip.Trigger>
        <Tooltip.Content>TODO: about</Tooltip.Content>
      </Tooltip.Root>
      <Separator orientation="vertical" />
      <PlaybackButton />
      <ExampleSelect />
      <EditorStatus />
    </div>
  )
}
