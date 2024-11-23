import type { Meta, StoryObj } from '@storybook/react'

import { cn } from '#lib/classnames'
import { Separator, type SeparatorProps } from './separator'

type StoryArgs = SeparatorProps

export default {
  title: 'components/Separator',
  component: Separator,
  render: ({ orientation, ...args }) => (
    <div className={cn('flex size-80 gap-4', orientation === 'horizontal' ? 'flex-col' : 'flex-row')}>
      <div className="flex-1 rounded-lg border border-dashed" />
      <Separator orientation={orientation} {...args} />
      <div className="flex-1 rounded-lg border border-dashed" />
    </div>
  ),
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'] satisfies StoryArgs['orientation'][],
    },
    asChild: {
      table: { disable: true },
    },
  },
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

export const Default: Story = {
  args: {
    orientation: 'horizontal',
    decorative: true,
  },
}
