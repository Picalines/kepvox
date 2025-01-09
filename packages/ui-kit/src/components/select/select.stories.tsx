import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { Select } from '.'

type StoryArgs = { placeholder: string; numberOfGroups: number } & Select.RootProps

export default {
  title: 'components/Select',
  component: Select.Root,
  render: ({ placeholder, numberOfGroups, ...rootProps }) => (
    <Select.Root {...rootProps}>
      <Select.Trigger placeholder={placeholder} />
      <Select.Content>
        {new Array(numberOfGroups).fill(null).map((_, index) => (
          <Select.Group key={String(index)} id={`group-${index}`}>
            <Select.Label>Group {index + 1}</Select.Label>
            <Select.Item value={`${index + 1}-1`}>Item 1 ({index + 1})</Select.Item>
            <Select.Item value={`${index + 1}-2`}>Item 2 ({index + 1})</Select.Item>
            <Select.Item value={`${index + 1}-3`}>Item 3 ({index + 1})</Select.Item>
          </Select.Group>
        ))}
      </Select.Content>
    </Select.Root>
  ),
  args: {
    onValueChange: fn(),
  },
  decorators: [
    Story => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

export const Default: Story = {
  args: {
    placeholder: 'Select option...',
    numberOfGroups: 2,
  },
}

export const Open: Story = {
  args: {
    ...Default.args,
    open: true,
  },
}

export const OpenMany: Story = {
  args: {
    ...Open.args,
    numberOfGroups: 10,
  },
}
