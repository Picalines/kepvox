import { Heading } from '@repo/ui-kit/components/heading'
import { Separator } from '@repo/ui-kit/components/separator'
import { ThemeSwitcher } from '@repo/ui-kit/components/theme'
import type { FC } from 'react'
import { EditorStatus } from './editor-status'
import { LoadExampleButton } from './load-example-button'
import { PlaybackButton } from './playback-button'
import { PlaybackTimer } from './playback-timer'

export const EditorHeader: FC = () => {
  return (
    <div className="flex w-full items-center gap-2 border-b-2 bg-background p-2">
      <Heading.Root>
        <Heading.SuperTitle>@kepvox/synth</Heading.SuperTitle>
        <Heading.Title>playground</Heading.Title>
      </Heading.Root>
      <Separator orientation="vertical" />
      <PlaybackButton />
      <LoadExampleButton />
      <EditorStatus />
      <PlaybackTimer />
      <div className="grow" />
      <ThemeSwitcher variant="outline" size="lg" />
    </div>
  )
}
