import type { Meta, StoryObj } from '@storybook/react'

import { fn } from '@storybook/test'
import { Button } from '../button'
import { Heading } from '../heading'
import { Dialog, type DialogProps } from './dialog'

type StoryArgs = DialogProps & Partial<{ title: string; description: string; closable: boolean }>

export default {
  title: 'components/Dialog',
  component: Dialog,
  args: {
    onOpen: fn(),
    onClose: fn(),
  },
  render: ({ title, description, closable, ...args }) => (
    <Dialog {...args}>
      <Dialog.Trigger asChild>
        <Button>Button</Button>
      </Dialog.Trigger>
      <Dialog.Content closable={closable}>
        <Heading>
          <Heading.Title>{title}</Heading.Title>
          <Heading.Description color="secondary">{description}</Heading.Description>
        </Heading>
      </Dialog.Content>
    </Dialog>
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
