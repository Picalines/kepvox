import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { cn } from '#lib/classnames'
import { Popover } from '.'
import { Button } from '../button'

type StoryArgs = Popover.RootProps & Popover.ContentProps

export default {
  title: 'components/Popover',
  component: Popover.Root,
  render: ({ open, defaultOpen, onOpenChange, ...contentProps }) => (
    <Popover.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <Popover.Trigger>
        <Button>Button</Button>
      </Popover.Trigger>
      <Popover.Content {...contentProps} className={cn('w-min', contentProps.className)}>
        Content
      </Popover.Content>
    </Popover.Root>
  ),
  decorators: [
    Story => (
      <div className="w-min rounded-lg border border-dashed p-20">
        <Story />
      </div>
    ),
  ],
  args: {
    onOpenChange: fn(),
  },
  argTypes: {
    side: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'] satisfies StoryArgs['side'][],
    },
    align: {
      control: 'inline-radio',
      options: ['start', 'center', 'end'] satisfies StoryArgs['align'][],
    },
    onOpenChange: {
      table: { disable: true },
    },
  },
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

export const Top: Story = {
  args: {
    defaultOpen: true,
    side: 'top',
    align: 'center',
    sideOffset: 4,
    alignOffset: 0,
  },
}

export const Left: Story = {
  args: {
    ...Top.args,
    side: 'left',
  },
}

export const Right: Story = {
  args: {
    ...Top.args,
    side: 'right',
  },
}

export const Bottom: Story = {
  args: {
    ...Top.args,
    side: 'bottom',
  },
}
