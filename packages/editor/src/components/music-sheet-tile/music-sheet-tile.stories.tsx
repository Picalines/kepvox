import type { Meta, StoryObj } from '@storybook/react'
import { type Scope, allSettled, fork } from 'effector'
import type { ComponentProps } from 'react'
import { mockRunningAudioContext } from '#__mock__/audio-context'
import { simpleProjectMock } from '#__mock__/project'
import { EditorScope } from '#components/editor'
import { type ActionPayload, editorModel } from '#model'
import { MusicSheetTile } from './music-sheet-tile'

type StoryArgs = ComponentProps<typeof MusicSheetTile>

export default {
  title: 'components/MusicSheetTile',
  component: MusicSheetTile,
  beforeEach: () => mockRunningAudioContext(),
  decorators: [
    (Story, { parameters: { scope } }) => (
      <EditorScope scope={scope}>
        <Story />
      </EditorScope>
    ),
    Story => (
      <div className="h-128 w-160 border">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

const selectNotes = async (scope: Scope) => {
  await allSettled(editorModel.userRequestedActions, {
    scope,
    params: [
      { action: 'sheet-note-select', id: 'note-3', selected: true },
      { action: 'sheet-note-select', id: 'note-4', selected: true },
    ] satisfies ActionPayload[],
  })
}

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

    await selectNotes(scope)
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

    await selectNotes(scope)
  },
}
