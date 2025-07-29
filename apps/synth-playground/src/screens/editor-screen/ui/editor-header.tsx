import { Heading } from '@repo/ui-kit/components/heading'
import { ThemeSwitcher } from '@repo/ui-kit/components/theme'
import type { FC } from 'react'
import { EditorStatus } from './editor-status'
import { LoadExampleButton } from './load-example-button'
import { PlaybackButton } from './playback-button'
import { PlaybackTimer } from './playback-timer'

export const EditorHeader: FC = () => {
  return (
    <div className="flex w-full items-center gap-2 border-b-2 bg-background p-2">
      <PlaybackButton />
      <LoadExampleButton />
      <PlaybackTimer />
      <EditorStatus />
      <div className="grow" />
      <Heading.Root align="end">
        <Heading.SuperTitle>@kepvox/synth</Heading.SuperTitle>
        <Heading.Title>playground</Heading.Title>
      </Heading.Root>
      <ThemeSwitcher variant="outline" size="lg" />
    </div>
  )
}
