import type { Meta, StoryObj } from '@storybook/react'
import type { ReactNode } from 'react'

import { Slider } from '.'

type StoryArgs = Slider.RootProps & { label: ReactNode }

export default {
  title: 'components/Slider',
  component: Slider.Root,
  render: ({ label, ...args }) => (
    <Slider.Root {...args}>
      <Slider.Label>{label}</Slider.Label>
    </Slider.Root>
  ),
  decorators: Story => (
    <div className="max-w-40">
      <Story />
    </div>
  ),
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

export const Default: Story = {
  args: {
    label: <>Field</>,
    defaultValue: 50,
    min: 0,
    max: 100,
  },
}

export const Full: Story = {
  args: {
    ...Default.args,
    defaultValue: 100,
    max: 100,
  },
}

export const Empty: Story = {
  args: {
    ...Default.args,
    defaultValue: 0,
    min: 0,
  },
}

export const NoLabel: Story = {
  args: {
    ...Default.args,
    label: null,
  },
}

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
}
