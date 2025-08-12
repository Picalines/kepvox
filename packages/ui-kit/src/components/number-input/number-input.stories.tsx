import type { Meta, StoryObj } from '@storybook/react-vite'

import { fn } from 'storybook/test'
import { NumberInput } from '.'

type StoryArgs = NumberInput.RootProps & {
  label: string
}

export default {
  title: 'inputs/NumberInput',
  component: NumberInput.Root,
  render: ({ label, ...props }) => (
    <NumberInput.Root {...props}>
      <NumberInput.Label>{label}</NumberInput.Label>
    </NumberInput.Root>
  ),
  args: {
    onValueChange: fn(),
  },
  decorators: [
    Story => (
      <div className="max-w-96 pt-2">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

export const Default: Story = {
  args: {
    label: 'Field label',
  },
}

export const WithValue: Story = {
  args: {
    ...Default.args,
    defaultValue: 123,
  },
}

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
}

export const DisabledWithValue: Story = {
  args: {
    ...Disabled.args,
    defaultValue: 123,
  },
}
