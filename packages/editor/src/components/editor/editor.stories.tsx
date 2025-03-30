import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import type { ComponentProps } from 'react'
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
    onProjectSerialized: fn(),
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

export const Default: Story = {
  args: {
    initialProject: {
      synthTree: {
        nodes: {
          out: {
            type: 'output',
            position: { x: 0, y: 0 },
          },
          gen: {
            type: 'generator',
            position: { x: -200, y: 0 },
          },
        },
        edges: {
          main: {
            source: { node: 'gen', socket: 0 },
            target: { node: 'out', socket: 0 },
          },
        },
      },
    },
  },
}
