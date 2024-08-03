import type { Meta, StoryObj } from '@storybook/react'

import { Button } from './button'

export default {
  title: 'components/Button',
  component: Button,
  render: args => <Button {...args}>Button</Button>,
} as Meta<typeof Button>

type Story = StoryObj<typeof Button>

export const Default: Story = {
  args: {
    variant: 'default',
    size: 'default',
    asChild: false,
  },
}
