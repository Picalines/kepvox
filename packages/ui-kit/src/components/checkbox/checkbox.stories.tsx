import type { Meta, StoryObj } from '@storybook/react'

import { Checkbox } from '.'

type StoryArgs = Checkbox.RootProps & Partial<{ label: string }>

export default {
  title: 'components/Checkbox',
  component: Checkbox.Root,
  render: ({ label, ...args }) => (
    <Checkbox.Root {...args}>
      <Checkbox.Label>{label}</Checkbox.Label>
    </Checkbox.Root>
  ),
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

export const Default: Story = {
  args: {
    label: 'Allow editing',
  },
}

export const Checked: Story = {
  args: {
    ...Default.args,
    checked: true,
  },
}

export const Unchecked: Story = {
  args: {
    ...Checked.args,
    checked: false,
  },
}

export const CheckedAndDisabled: Story = {
  args: {
    ...Checked.args,
    disabled: true,
  },
}

export const UncheckedAndDisabled: Story = {
  args: {
    ...Unchecked.args,
    disabled: true,
  },
}
