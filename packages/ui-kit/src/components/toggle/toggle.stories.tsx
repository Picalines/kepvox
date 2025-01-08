import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'

import { Toggle, type ToggleProps } from './toggle'

type StoryArgs = ToggleProps

export default {
  title: 'components/Toggle',
  component: Toggle,
  args: {
    onClick: fn(),
    onToggle: fn(),
  },
  argTypes: {
    size: {
      control: 'select',
    },
    onClick: {
      table: { disable: true },
    },
    onToggle: {
      table: { disable: true },
    },
  },
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

export const Default: Story = {
  args: {
    children: 'Toggle',
    variant: 'ghost',
    size: 'md',
  },
}
