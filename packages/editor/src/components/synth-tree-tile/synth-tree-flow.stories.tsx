import { Tooltip } from '@repo/ui-kit/components/tooltip'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { allSettled, fork } from 'effector'
import type { ComponentProps } from 'react'
import { simpleProjectMock } from '#__mock__/project'
import { EditorScope } from '#components/editor'
import { editorModel } from '#model'
import { SynthTreeTile } from './synth-tree-tile'

type StoryArgs = ComponentProps<typeof SynthTreeTile>

export default {
  title: 'tiles/SynthTree',
  component: SynthTreeTile,
  decorators: [
    (Story, { parameters: { scope } }) => (
      <Tooltip.Provider>
        <EditorScope scope={scope}>
          <Story />
        </EditorScope>
      </Tooltip.Provider>
    ),
    Story => (
      <div className="h-128 border bg-background">
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
