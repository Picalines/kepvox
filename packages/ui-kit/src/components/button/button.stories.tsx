import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'

import { PaletteIcon } from '#icons'
import { Button, type ButtonProps } from './button'

type StoryArgs = ButtonProps

export default {
  title: 'components/Button',
  component: Button,
  args: {
    onClick: fn(),
  },
  argTypes: {
    onClick: {
      table: { disable: true },
    },
    asChild: {
      table: { disable: true },
    },
  },
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

export const Primary: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'md',
    shape: 'pill',
  },
}

export const Secondary: Story = {
  args: {
    ...Primary.args,
    variant: 'secondary',
  },
}

export const Ghost: Story = {
  args: {
    ...Primary.args,
    variant: 'ghost',
  },
}

export const Outline: Story = {
  args: {
    ...Primary.args,
    variant: 'outline',
  },
}

export const Icon: Story = {
  args: {
    ...Primary.args,
    children: <PaletteIcon className="absolute" />,
    size: 'md',
    shape: 'square',
  },
  argTypes: {
    children: {
      table: { disable: true },
    },
  },
}
