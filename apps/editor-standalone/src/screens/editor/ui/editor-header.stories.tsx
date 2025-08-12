import type { Meta, StoryObj } from '@storybook/nextjs'
import { allSettled, fork } from 'effector'
import { Provider as ScopeProvider } from 'effector-react'
import type { ComponentProps } from 'react'
import { model } from '../model'
import { EditorHeader } from './editor-header'

type StoryArgs = ComponentProps<typeof EditorHeader>

export default {
  title: 'screens/Editor/EditorHeader',
  component: EditorHeader,
  decorators: [
    (Story, { parameters: { scope } }) => (
      <ScopeProvider value={scope}>
        <Story />
      </ScopeProvider>
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
