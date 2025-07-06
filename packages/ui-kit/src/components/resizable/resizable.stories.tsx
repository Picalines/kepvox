import type { Meta, StoryObj } from '@storybook/react'
import { Fragment } from 'react'
import { GripVerticalIcon } from '#icons'
import { cn } from '#lib/classnames'
import { Resizable } from '.'

type StoryArgs = Resizable.GroupProps & { numberOfPanels: number }

export default {
  title: 'layout/Resizable',
  component: Resizable.Group,
  render: ({ numberOfPanels, ...args }) => (
    <Resizable.Group {...args} className={cn('size-full rounded-lg border', args.className)}>
      <Resizable.Panel className="flex items-center justify-center p-5">Panel 1</Resizable.Panel>
      {new Array(numberOfPanels - 1).fill(null).map((_, index) => (
        <Fragment key={String(index)}>
          <Resizable.Handle>
            <GripVerticalIcon />
          </Resizable.Handle>
          <Resizable.Panel className="flex items-center justify-center p-5">Panel {index + 2}</Resizable.Panel>
        </Fragment>
      ))}
    </Resizable.Group>
  ),
  decorators: [
    Story => (
      <div className="size-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

export const Horizontal: Story = {
  args: {
    direction: 'horizontal',
    numberOfPanels: 2,
  },
}

export const Vertical: Story = {
  args: {
    ...Horizontal.args,
    direction: 'vertical',
  },
}

export const TripleHorizontal: Story = {
  args: {
    ...Horizontal.args,
    numberOfPanels: 3,
  },
}

export const TripleVertical: Story = {
  args: {
    ...Vertical.args,
    numberOfPanels: 3,
  },
}
