import type { Meta, StoryObj } from '@storybook/react'

import { fn } from '@storybook/test'
import { TextInput } from '.'

type StoryArgs = TextInput.RootProps & {
  label: string
}

export default {
  title: 'components/TextInput',
  component: TextInput.Root,
  render: ({ label, ...props }) => (
    <TextInput.Root {...props}>
      <TextInput.Label>{label}</TextInput.Label>
    </TextInput.Root>
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
    defaultValue: 'Value',
  },
}

export const Password: Story = {
  args: {
    ...Default.args,
    label: 'Password',
    type: 'password',
    defaultValue: '12345',
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
    defaultValue: 'Value',
  },
}
