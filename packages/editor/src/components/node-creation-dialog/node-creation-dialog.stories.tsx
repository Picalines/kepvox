import type { Meta, StoryObj } from '@storybook/react-vite'
import { allSettled, fork } from 'effector'
import type { ComponentProps } from 'react'
import { mockRunningAudioContext } from '#__mock__/audio-context'
import { simpleProjectMock } from '#__mock__/project'
import { EditorScope } from '#components/editor'
import { editorModel } from '#model'
import { NodeCreationDialog } from './node-creation-dialog'

type StoryArgs = ComponentProps<typeof NodeCreationDialog>

export default {
  title: 'dialogs/NodeCreationDialog',
  component: NodeCreationDialog,
  beforeEach: () => mockRunningAudioContext(),
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
    await allSettled(editorModel.userSelectedNodePosition, {
      scope,
      params: { position: { x: 0, y: 0 } },
    })
  },
}
