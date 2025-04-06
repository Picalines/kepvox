import type { Meta, StoryObj } from '@storybook/react'
import { allSettled, fork } from 'effector'
import type { ComponentProps } from 'react'
import { mockRunningAudioContext } from '#__mock__/audio-context'
import { simpleProjectMock } from '#__mock__/project'
import { EditorScope } from '#components/editor'
import { editorModel } from '#model'
import { PlaybackControls } from './playback-controls'

type StoryArgs = ComponentProps<typeof PlaybackControls>

export default {
  title: 'components/PlaybackControls',
  component: PlaybackControls,
  beforeEach: () => mockRunningAudioContext(),
  decorators: [
    (Story, { parameters: { scope } }) => (
      <EditorScope scope={scope}>
        <Story />
      </EditorScope>
    ),
  ],
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

const defaultScope = fork()

export const Default: Story = {
  parameters: { scope: defaultScope },
}

const playingScope = fork()

export const Playing: Story = {
  parameters: { scope: playingScope },

  beforeEach: async () => {
    const state = { externalLoading: false, initialProject: simpleProjectMock } as const
    await allSettled(editorModel.Gate.close, { scope: playingScope, params: state })
    await allSettled(editorModel.Gate.open, { scope: playingScope, params: state })

    // NOTE: it won't settle, so don't await
    allSettled(editorModel.playbackStarted, { scope: playingScope })
  },
}
