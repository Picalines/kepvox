import type { Meta, StoryObj } from '@storybook/nextjs'

import { Tooltip } from '@repo/ui-kit/components/tooltip'
import { allSettled, fork } from 'effector'
import { Provider as ScopeProvider } from 'effector-react'
import type { ComponentProps } from 'react'
import { mockRunningAudioContext } from '#shared/__mock__/audio-context'
import { model } from '../model'
import { EditorHeader } from './editor-header'

type StoryArgs = ComponentProps<typeof EditorHeader>

export default {
  title: 'screens/EditorScreen/EditorHeader',
  component: EditorHeader,
  beforeEach: () => mockRunningAudioContext(),
  decorators: [
    (Story, { parameters: { scope } }) => (
      <ScopeProvider value={scope}>
        <Story />
      </ScopeProvider>
    ),
    Story => (
      <Tooltip.Provider>
        <div className="flex h-20 flex-col">
          <Story />
        </div>
      </Tooltip.Provider>
    ),
  ],
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

export const Default: Story = {
  parameters: { scope: fork() },
  beforeEach: async ({ parameters: { scope } }) => {
    await allSettled(model.Gate.close, { scope, params: {} })
    await allSettled(model.Gate.open, { scope, params: {} })
  },
}

export const Playing: Story = {
  parameters: { scope: fork() },
  beforeEach: async ({ parameters: { scope } }) => {
    await allSettled(model.Gate.close, { scope, params: {} })
    await allSettled(model.Gate.open, { scope, params: {} })

    // NOTE: it won't settle, so don't await
    allSettled(model.userToggledPlayback, { scope })
  },
}

export const CodeError: Story = {
  parameters: { scope: fork() },
  beforeEach: async ({ parameters: { scope } }) => {
    await allSettled(model.Gate.close, { scope, params: {} })
    await allSettled(model.Gate.open, { scope, params: {} })

    await allSettled(model.userChangedCode, { scope, params: 'notDefined' })
    await allSettled(model.userToggledPlayback, { scope })
  },
}
