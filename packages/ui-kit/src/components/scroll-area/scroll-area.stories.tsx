import type { Meta, StoryObj } from '@storybook/react-vite'
import { ScrollArea } from '.'

type StoryArgs = ScrollArea.RootProps & {
  orientation: ScrollArea.BarProps['orientation'] | 'both'
}

export default {
  title: 'layout/ScrollArea',
  component: ScrollArea.Root,
  decorators: [
    Story => (
      <div className="size-50">
        <Story />
      </div>
    ),
  ],
  render: ({ orientation }) => (
    <ScrollArea.Root>
      {orientation === 'both' && <ScrollArea.Bar orientation="vertical" />}
      {orientation === 'both' && <ScrollArea.Bar orientation="horizontal" />}
      {orientation !== 'both' && <ScrollArea.Bar orientation={orientation} />}
      <ScrollArea.Content>
        <div className="grid size-128 grid-cols-8 gap-1">
          {Array.from({ length: 64 }).map((_, i) => (
            <div key={String(i)} className="border text-center">
              {i}
            </div>
          ))}
        </div>
      </ScrollArea.Content>
    </ScrollArea.Root>
  ),
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
}

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
  },
}

export const Both: Story = {
  args: {
    orientation: 'both',
  },
}
