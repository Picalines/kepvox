import type { Meta, StoryObj } from '@storybook/react'

import { Heading } from '.'

type StoryArgs = Heading.RootProps & Partial<{ superTitle: string; title: string; description: string }>

export default {
  title: 'typography/Heading',
  component: Heading.Root,
  render: ({ superTitle, title, description, ...args }) => (
    <Heading.Root {...args}>
      {superTitle ? <Heading.SuperTitle>{superTitle}</Heading.SuperTitle> : null}
      {title ? <Heading.Title>{title}</Heading.Title> : null}
      {description ? <Heading.Description>{description}</Heading.Description> : null}
    </Heading.Root>
  ),
  decorators: [
    Story => (
      <div className="max-w-32">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

export const Default: Story = {
  args: {
    superTitle: 'SuperTitle',
    title: 'Title',
    description: 'Description',
  },
}

export const Center: Story = {
  args: {
    ...Default.args,
    align: 'center',
  },
}

export const Right: Story = {
  args: {
    ...Default.args,
    align: 'end',
  },
}

export const NoSuperTitle: Story = {
  args: {
    ...Default.args,
    superTitle: undefined,
  },
}

export const NoDescription: Story = {
  args: {
    ...Default.args,
    description: undefined,
  },
}

export const NoTitle: Story = {
  args: {
    ...Default.args,
    title: undefined,
  },
}
