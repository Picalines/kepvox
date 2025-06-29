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
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

export const Primary: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'md',
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
    children: <PaletteIcon />,
    size: 'md',
  },
  argTypes: {
    children: {
      table: { disable: true },
    },
  },
}

export const IconWithText: Story = {
  args: {
    ...Primary.args,
    children: (
      <>
        <PaletteIcon /> Palette
      </>
    ),
    size: 'md',
  },
  argTypes: {
    children: {
      table: { disable: true },
    },
  },
}
