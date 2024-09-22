import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'

import { Button, type ButtonProps } from './button'

type StoryArgs = ButtonProps

export default {
  title: 'components/Button',
  component: Button,
  args: {
    onClick: fn(),
  },
  argTypes: {
    size: {
      control: 'select',
    },
    onClick: {
      table: { disable: true },
    },
    asChild: {
      table: { disable: true },
    },
  },
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'default',
  },
}
