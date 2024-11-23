import type { Meta, StoryObj } from '@storybook/react'
import { cn } from '#lib/classnames'
import { Resizable, type ResizableProps } from './resizable'

type StoryArgs = ResizableProps & { handleContent: string }

export default {
  title: 'components/Resizable',
  component: Resizable,
  render: ({ handleContent, ...args }) => (
    <div className="size-[400px]">
      <Resizable {...args} className={cn('size-full rounded-lg border', args.className)}>
        <Resizable.Panel className="flex items-center justify-center p-5">Panel 1</Resizable.Panel>
        <Resizable.Handle>{handleContent}</Resizable.Handle>
        <Resizable.Panel className="flex items-center justify-center p-5">Panel 2</Resizable.Panel>
      </Resizable>
    </div>
  ),
  argTypes: {
    direction: {
      control: 'select',
      options: ['horizontal', 'vertical'] satisfies StoryArgs['direction'][],
    },
  },
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

export const Default: Story = {
  args: {
    direction: 'horizontal',
    handleContent: '',
  },
}
