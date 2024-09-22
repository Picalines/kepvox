import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'

import { Button, type ButtonProps, type ButtonSize, type ButtonVariant } from './button'

type StoryArgs = ButtonProps

export default {
  title: 'components/Button',
  component: Button,
  args: {
    onClick: fn(),
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'outline', 'link'] satisfies ButtonVariant[],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'] satisfies ButtonSize[],
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
    size: 'md',
  },
}
