import type { Meta, StoryObj } from '@storybook/react'
import { allSettled, fork } from 'effector'
import type { ComponentProps } from 'react'
import { mockSuspendedAudioContext } from '#__mock__/audio-context'
import { simpleProjectMock } from '#__mock__/project'
import { EditorScope } from '#components/editor'
import { editorModel } from '#model'
import { AudioPermissionDialog } from './audio-permission-dialog'

type StoryArgs = ComponentProps<typeof AudioPermissionDialog>

export default {
  title: 'components/AudioPermissionDialog',
  component: AudioPermissionDialog,
  beforeEach: () => mockSuspendedAudioContext(),
  decorators: [
    (Story, { parameters: { scope } }) => (
      <EditorScope scope={scope}>
        <div>page</div>
        <Story />
      </EditorScope>
    ),
  ],
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

export const Default: Story = {
  parameters: { scope: fork() },

  beforeEach: async ({ parameters: { scope } }) => {
    const state = {
      externalLoading: false,
      initialProject: simpleProjectMock,
      serializationTimeout: 0,
      readonly: false,
    } as const

    await allSettled(editorModel.Gate.close, { scope, params: state })
    await allSettled(editorModel.Gate.open, { scope, params: state })
  },
}
