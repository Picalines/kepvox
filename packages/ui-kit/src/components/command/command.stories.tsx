import type { Meta, StoryObj } from '@storybook/react'

import { fn } from '@storybook/test'
import { Command } from '.'
import { commandGroups } from './__mock__'

type StoryArgs = Command.RootProps & {
  data: typeof commandGroups
  inputDisabled?: boolean
  onSelect?: () => void
}

export default {
  title: 'components/Command',
  component: Command.Root,
  render: ({ data, inputDisabled, onSelect, ...props }) => (
    <Command.Root {...props}>
      <Command.Input placeholder="Select action..." disabled={inputDisabled} />
      <Command.Empty>Empty</Command.Empty>
      {data.map((group, groupIndex) => (
        <Command.Group key={String(groupIndex)}>
          <Command.Label>{group.label}</Command.Label>
          {group.items.map((item, itemIndex) => (
            <Command.Item key={String(itemIndex)} onSelect={onSelect}>
              {item}
            </Command.Item>
          ))}
        </Command.Group>
      ))}
    </Command.Root>
  ),
  args: {
    onSelect: fn(),
  },
  decorators: [
    Story => (
      <div className="max-w-96 pt-2">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

export const Default: Story = {
  args: {
    data: commandGroups,
  },
}

export const DisabledInput: Story = {
  args: {
    ...Default.args,
    inputDisabled: true,
  },
}

export const Empty: Story = {
  args: {
    ...Default.args,
    data: [],
  },
}
