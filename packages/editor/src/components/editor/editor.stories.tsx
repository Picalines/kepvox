import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import type { ComponentProps } from 'react'
import { simpleProjectMock } from '#__mock__/project'
import { Editor } from './editor'

type StoryArgs = ComponentProps<typeof Editor>

export default {
  title: 'components/Editor',
  component: Editor,
  decorators: [
    Story => (
      <div className="h-dvh w-dvw">
        <Story />
      </div>
    ),
  ],
  args: {
    onSerialized: fn(),
    onPlayingChange: fn(),
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

export const Default: Story = {
  args: {
    initialProject: simpleProjectMock,
  },
}

export const Readonly: Story = {
  args: {
    ...Default.args,
    readonly: true,
  },
}
