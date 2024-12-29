import type { Meta, StoryObj } from '@storybook/react'
import { cn } from '#lib/classnames'
import { Resizable } from '.'

type StoryArgs = Resizable.GroupProps & { handleContent: string }

export default {
  title: 'components/Resizable',
  component: Resizable.Group,
  render: ({ handleContent, ...args }) => (
    <div className="size-[400px]">
      <Resizable.Group {...args} className={cn('size-full rounded-lg border', args.className)}>
        <Resizable.Panel className="flex items-center justify-center p-5">Panel 1</Resizable.Panel>
        <Resizable.Handle>{handleContent}</Resizable.Handle>
        <Resizable.Panel className="flex items-center justify-center p-5">Panel 2</Resizable.Panel>
      </Resizable.Group>
    </div>
  ),
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

export const Default: Story = {
  args: {
    direction: 'horizontal',
    handleContent: '',
  },
}
