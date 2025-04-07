import type { Meta, StoryObj } from '@storybook/react'
import { allSettled, fork } from 'effector'
import type { ComponentProps } from 'react'
import { mockRunningAudioContext } from '#__mock__/audio-context'
import { simpleProjectMock } from '#__mock__/project'
import { EditorScope } from '#components/editor'
import { editorModel } from '#model'
import { NodeTile } from './node-tile'

type StoryArgs = ComponentProps<typeof NodeTile>

export default {
  title: 'components/NodeTile',
  component: NodeTile,
  beforeEach: () => mockRunningAudioContext(),
  decorators: [
    (Story, { parameters: { scope } }) => (
      <EditorScope scope={scope}>
        <Story />
      </EditorScope>
    ),
    Story => (
      <div className="h-128 w-64 border">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

export const Default: Story = {
  parameters: { scope: fork() },

  beforeEach: async ({ parameters: { scope } }) => {
    const state = { externalLoading: false, initialProject: simpleProjectMock, serializationTimeout: 0 } as const
    await allSettled(editorModel.Gate.close, { scope, params: state })
    await allSettled(editorModel.Gate.open, { scope, params: state })
  },
}

export const Selected: Story = {
  parameters: { scope: fork() },

  beforeEach: async ({ parameters: { scope } }) => {
    const state = { externalLoading: false, initialProject: simpleProjectMock, serializationTimeout: 0 } as const
    await allSettled(editorModel.Gate.close, { scope, params: state })
    await allSettled(editorModel.Gate.open, { scope, params: state })

    await allSettled(editorModel.actionDispatched, {
      scope,
      params: {
        action: 'synth-node-selected',
        id: 'gen',
        selected: true,
      },
    })
  },
}
