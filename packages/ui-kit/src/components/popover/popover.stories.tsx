import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { cn } from '#lib/classnames'
import { Popover } from '.'
import { Button } from '../button'

type StoryArgs = Popover.RootProps & Popover.ContentProps

export default {
  title: 'layout/Popover',
  component: Popover.Root,
  render: ({ open, defaultOpen, onOpenChange, ...contentProps }) => (
    <Popover.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <Popover.Trigger>
        <Button.Root>
          <Button.Text>Button</Button.Text>
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content {...contentProps} className={cn('w-min', contentProps.className)}>
        Content
      </Popover.Content>
    </Popover.Root>
  ),
  decorators: [
    Story => (
      <div className="w-min rounded-lg border border-dashed px-28 py-20">
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
