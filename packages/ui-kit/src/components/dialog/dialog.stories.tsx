import type { Meta, StoryObj } from '@storybook/react'

import { fn } from '@storybook/test'
import { Button } from '../button'
import { Heading } from '../heading'
import { Dialog, type DialogProps } from './dialog'

type StoryArgs = DialogProps &
  Partial<{ title: string; description: string; showClose: boolean; closeOnOutside: boolean }>

export default {
  title: 'components/Dialog',
  component: Dialog,
  args: {
    onOpen: fn(),
    onClose: fn(),
  },
  render: ({ title, description, showClose, closeOnOutside, ...args }) => (
    <Dialog {...args}>
      <Dialog.Trigger asChild>
        <Button>Button</Button>
      </Dialog.Trigger>
      <Dialog.Content showClose={showClose} closeOnOutside={closeOnOutside}>
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
    showClose: true,
    title: 'Title',
    description: 'Description',
    closeOnOutside: true,
  },
}
