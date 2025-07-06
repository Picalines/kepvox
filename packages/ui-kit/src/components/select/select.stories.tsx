import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { Select } from '.'
import { selectGroups } from './__mock__'

type StoryArgs = { label: string; numberOfGroups: number } & Select.RootProps

export default {
  title: 'inputs/Select',
  component: Select.Root,
  render: ({ label, numberOfGroups, ...rootProps }) => (
    <Select.Root {...rootProps}>
      <Select.Label>{label}</Select.Label>
      <Select.Trigger />
      <Select.Content>
        {Iterator.from(selectGroups)
          .take(numberOfGroups)
          .map(({ group, items }, index) => (
            <Select.Group key={group} id={`group-${index}`}>
              <Select.Header>{group}</Select.Header>
              {items.map(value => (
                <Select.Item key={value} value={value}>
                  {value}
                </Select.Item>
              ))}
            </Select.Group>
          ))
          .toArray()}
      </Select.Content>
    </Select.Root>
  ),
  args: {
    onValueChange: fn(),
  },
  decorators: [
    Story => (
      <div className="flex pt-2">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

export const Default: Story = {
  args: {
    label: 'Food',
    numberOfGroups: 1,
  },
}

export const WithValue: Story = {
  args: {
    ...Default.args,
    value: selectGroups[0].items[0],
  },
}

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
}

export const DisabledWithValue: Story = {
  args: {
    ...Disabled.args,
    value: selectGroups[0].items[0],
  },
}

export const Open: Story = {
  args: {
    ...Default.args,
    open: true,
  },
}

export const OpenWithValue: Story = {
  args: {
    ...Open.args,
    value: selectGroups[0].items[0],
  },
}

export const OpenMany: Story = {
  args: {
    ...Open.args,
    numberOfGroups: 10,
  },
}

export const Small: Story = {
  args: {
    ...Default.args,
    size: 'sm',
  },
}

export const Large: Story = {
  args: {
    ...Default.args,
    size: 'lg',
  },
}
