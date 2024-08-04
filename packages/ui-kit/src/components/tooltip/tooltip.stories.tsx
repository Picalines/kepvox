import type { Meta, StoryObj } from '@storybook/react'

import { Button } from '../button'
import { Tooltip, type TooltipContentProps, type TooltipProps } from './tooltip'

type StoryArgs = TooltipProps & {
  text: string
  side: TooltipContentProps['side']
  hasArrow: boolean
}

export default {
  title: 'components/Tooltip',
  component: Tooltip,
  render: ({ text, side, hasArrow, ...args }) => (
    <Tooltip.Provider>
      <div className="flex max-w-[400px] justify-center rounded-lg border border-primary border-dashed p-20">
        <Tooltip {...args}>
          <Tooltip.Trigger asChild>
            <Button>Button</Button>
          </Tooltip.Trigger>
          <Tooltip.Content side={side}>{text}</Tooltip.Content>
          {hasArrow && <Tooltip.Arrow />}
        </Tooltip>
      </div>
    </Tooltip.Provider>
  ),
  argTypes: {
    side: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

export const Top: Story = {
  args: {
    text: 'Tooltip',
    side: 'top',
    hasArrow: true,
    defaultOpen: true,
  },
}

export const Left: Story = {
  args: {
    ...Top.args,
    side: 'left',
  },
}

export const Bottom: Story = {
  args: {
    ...Top.args,
    side: 'bottom',
  },
}

export const Right: Story = {
  args: {
    ...Top.args,
    side: 'right',
  },
}
