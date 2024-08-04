import type { Meta, StoryObj } from '@storybook/react'

import { Button, type ButtonProps } from './button'

type StoryArgs = ButtonProps & { text: string }

export default {
  title: 'components/Button',
  component: Button,
  render: ({ text, ...args }) => <Button {...args}>{text}</Button>,
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

export const Default: Story = {
  args: {
    text: 'Button',
    variant: 'default',
    size: 'default',
    asChild: false,
  },
}
