import type { Meta, StoryObj } from '@storybook/react'

import { Tooltip } from '.'
import { Button } from '../button'

type StoryArgs = Tooltip.RootProps &
  Tooltip.ContentProps & {
    text: string
    hasArrow: boolean
  }

export default {
  title: 'components/Tooltip',
  component: Tooltip.Root,
  render: ({ text, hasArrow, side, align, sideOffset, alignOffset, ...rootProps }) => (
    <Tooltip.Root {...rootProps}>
      <Tooltip.Trigger>
        <Button>Button</Button>
      </Tooltip.Trigger>
      <Tooltip.Content side={side} align={align} sideOffset={sideOffset} alignOffset={alignOffset}>
        {text}
      </Tooltip.Content>
      {hasArrow && <Tooltip.Arrow />}
    </Tooltip.Root>
  ),
  decorators: [
    Story => (
      <Tooltip.Provider>
        <div className="flex max-w-[400px] justify-center rounded-lg border border-dashed p-20">
          <Story />
        </div>
      </Tooltip.Provider>
    ),
  ],
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
    text: 'Tooltip',
    side: 'top',
    align: 'center',
    sideOffset: 4,
    alignOffset: 0,
    hasArrow: true,
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

export const NoArrow: Story = {
  args: {
    ...Top.args,
    hasArrow: false,
  },
}
