import type { Meta, StoryObj } from '@storybook/react'
import { Fragment } from 'react'
import { GripVerticalIcon } from '#icons'
import { Resizable } from '.'

type StoryArgs = Resizable.GroupProps & { numberOfPanels: number }

export default {
  title: 'layout/Resizable',
  component: Resizable.Group,
  render: ({ numberOfPanels, ...args }) => (
    <Resizable.Group {...args}>
      <Resizable.Panel>
        <div className="absolute inset-0 flex items-center justify-center">Panel 1</div>
      </Resizable.Panel>
      {new Array(numberOfPanels - 1).fill(null).map((_, index) => (
        <Fragment key={String(index)}>
          <Resizable.Handle>
            <GripVerticalIcon />
          </Resizable.Handle>
          <Resizable.Panel>
            <div className="absolute inset-0 flex items-center justify-center">Panel {index + 2}</div>
          </Resizable.Panel>
        </Fragment>
      ))}
    </Resizable.Group>
  ),
  decorators: [
    Story => (
      <div className="size-96 rounded-lg border">
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
