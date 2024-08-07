import type { Meta, StoryObj } from '@storybook/react'

import { Button } from '../button'
import { Popover, type PopoverContentProps, type PopoverProps } from './popover'

type StoryArgs = PopoverProps & Pick<PopoverContentProps, 'align' | 'sideOffset'>

export default {
  title: 'components/Popover',
  component: Popover,
  render: ({ align, sideOffset, ...props }) => (
    <div className="w-min rounded-lg border border-primary border-dashed p-20">
      <Popover {...props}>
        <Popover.Trigger asChild>
          <Button>Button</Button>
        </Popover.Trigger>
        <Popover.Content className="w-min" align={align} sideOffset={sideOffset}>
          Content
        </Popover.Content>
      </Popover>
    </div>
  ),
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

export const Center: Story = {
  args: {
    defaultOpen: true,
    align: 'center',
    sideOffset: 4,
  },
}

export const Start: Story = {
  args: {
    ...Center.args,
    align: 'start',
  },
}

export const End: Story = {
  args: {
    ...Center.args,
    align: 'end',
  },
}
