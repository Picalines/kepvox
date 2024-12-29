import type { Meta, StoryObj } from '@storybook/react'

import { fn } from '@storybook/test'
import { Dialog } from '.'
import { Button } from '../button'
import { Heading } from '../heading'

type StoryArgs = Dialog.RootProps & Partial<{ title: string; description: string; closable: boolean }>

export default {
  title: 'components/Dialog',
  component: Dialog.Root,
  args: {
    onOpen: fn(),
    onClose: fn(),
  },
  render: ({ title, description, closable, ...args }) => (
    <Dialog.Root {...args}>
      <Dialog.Trigger asChild>
        <Button>Button</Button>
      </Dialog.Trigger>
      <Dialog.Content closable={closable}>
        <Heading.Root>
          <Heading.Title>{title}</Heading.Title>
          <Heading.Description color="secondary">{description}</Heading.Description>
        </Heading.Root>
      </Dialog.Content>
    </Dialog.Root>
  ),
  argTypes: {
    open: {
      table: { disable: true },
    },
    onOpen: {
      table: { disable: true },
    },
    onClose: {
      table: { disable: true },
    },
  },
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

export const Default: Story = {
  args: {
    defaultOpen: false,
    closable: true,
    title: 'Title',
    description: 'Description',
  },
}
