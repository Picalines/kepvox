import type { Meta, StoryObj } from '@storybook/react'

import { Loader, type LoaderProps } from '.'

type StoryArgs = LoaderProps

export default {
  title: 'components/Loader',
  component: Loader,
  args: {
    centered: false,
  },
  argTypes: {
    className: {
      table: { disable: true },
    },
  },
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

export const Default: Story = {}

export const Centered: Story = {
  args: {
    ...Default.args,
    centered: true,
  },
  decorators: [
    Story => (
      <div className="relative h-40 w-40 rounded-sm border border-border border-dashed">
        <Story />
      </div>
    ),
  ],
}
