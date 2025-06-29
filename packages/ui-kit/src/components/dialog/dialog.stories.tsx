import type { Meta, StoryObj } from '@storybook/react'

import { Dialog } from '.'
import { Button } from '../button'

type StoryArgs = Dialog.RootProps & Partial<{ title: string; description: string; closable: boolean }>

export default {
  title: 'components/Dialog',
  component: Dialog.Root,
  render: ({ title, description, closable, ...args }) => (
    <Dialog.Root {...args}>
      <Dialog.Trigger>
        <Button id="dialog-trigger">Trigger</Button>
      </Dialog.Trigger>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Description>{description}</Dialog.Description>
      <Dialog.Content closable={closable}>
        <span id="dialog-content">Content</span>
      </Dialog.Content>
    </Dialog.Root>
  ),
  argTypes: {
    open: {
      table: { disable: true },
    },
  },
} satisfies Meta<StoryArgs>

type Story = StoryObj<StoryArgs>

export const Default: Story = {
  args: {
    closable: true,
    title: 'Title',
    description: 'Description',
  },
}

export const Open: Story = {
  args: {
    ...Default.args,
    open: true,
  },
}
