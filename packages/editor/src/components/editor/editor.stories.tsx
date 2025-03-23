import type { Meta, StoryObj } from '@storybook/react'
import { Editor } from './editor'

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
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

type Story = StoryObj

export const Default: Story = {}
