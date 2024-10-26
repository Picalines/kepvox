import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { cn } from '~/lib/classnames'
import { Button } from '../button'
import { Popover, type PopoverContentProps, type PopoverProps } from './popover'

type StoryArgs = PopoverProps & PopoverContentProps

export default {
  title: 'components/Popover',
  component: Popover,
  render: ({ open, defaultOpen, onOpen, onClose, ...contentProps }) => (
    <div className="w-min rounded-lg border border-dashed p-20">
      <Popover open={open} defaultOpen={defaultOpen} onOpen={onOpen} onClose={onClose}>
        <Popover.Trigger asChild>
          <Button>Button</Button>
        </Popover.Trigger>
        <Popover.Content {...contentProps} className={cn('w-min', contentProps.className)}>
          Content
        </Popover.Content>
      </Popover>
    </div>
  ),
  args: {
    onOpen: fn(),
    onClose: fn(),
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
    onOpen: {
      table: { disable: true },
    },
    onClose: {
      table: { disable: true },
    },
  },
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

export const Default: Story = {
  args: {
    defaultOpen: true,
    side: 'bottom',
    align: 'center',
    sideOffset: 4,
    alignOffset: 0,
  },
}
