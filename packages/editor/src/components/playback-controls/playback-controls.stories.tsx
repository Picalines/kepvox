import type { Meta, StoryObj } from '@storybook/react'
import { allSettled, fork } from 'effector'
import type { ComponentProps } from 'react'
import { mockRunningAudioContext } from '#__mock__/audio-context'
import { simpleProjectMock } from '#__mock__/project'
import { EditorScope } from '#components/editor'
import { type Project, editorModel } from '#model'
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

export const Default: Story = {
  parameters: { scope: fork() },
}

export const Playing: Story = {
  parameters: { scope: fork() },

  beforeEach: async ({ parameters: { scope } }) => {
    const infinteSilentProject: Project = {
      ...simpleProjectMock,
      musicSheet: { endingNote: Number.POSITIVE_INFINITY, notes: {} },
    }

    const state = { externalLoading: false, initialProject: infinteSilentProject, serializationTimeout: 0 } as const
    await allSettled(editorModel.Gate.close, { scope, params: state })
    await allSettled(editorModel.Gate.open, { scope, params: state })

    // NOTE: it won't settle, so don't await
    allSettled(editorModel.userToggledPlayback, { scope })
  },
}
