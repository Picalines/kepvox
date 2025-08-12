import type { Meta, StoryObj } from '@storybook/react-vite'
import { allSettled, fork } from 'effector'
import type { ComponentProps } from 'react'
import { simpleProjectMock } from '#__mock__/project'
import { EditorScope } from '#components/editor'
import { editorModel } from '#model'
import { NodeTile } from './node-tile'

type StoryArgs = ComponentProps<typeof NodeTile>

export default {
  title: 'tiles/Node',
  component: NodeTile,
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

export const Selected: Story = {
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

    await allSettled(editorModel.userRequestedActions, {
      scope,
      params: [
        {
          action: 'synth-node-select',
          id: 'generator',
          selected: true,
        },
      ],
    })
  },
}

export const Readonly: Story = {
  parameters: { scope: fork() },

  beforeEach: async ({ parameters: { scope } }) => {
    const state = {
      externalLoading: false,
      initialProject: simpleProjectMock,
      serializationTimeout: 0,
      readonly: true,
    } as const

    await allSettled(editorModel.Gate.close, { scope, params: state })
    await allSettled(editorModel.Gate.open, { scope, params: state })

    await allSettled(editorModel.userRequestedActions, {
      scope,
      params: [
        {
          action: 'synth-node-select',
          id: 'generator',
          selected: true,
        },
      ],
    })
  },
}
