import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Dialog } from '.'
import { Button } from '../button'

type StoryArgs = Dialog.RootProps & {
  title: string
  description: string
  onConfirm: () => void
}

export default {
  title: 'inputs/Dialog',
  component: Dialog.Root,
  render: ({ title, description, onConfirm, ...args }) => (
    <Dialog.Root {...args}>
      <Dialog.Trigger>
        <Button.Root>
          <Button.Text>Trigger</Button.Text>
        </Button.Root>
      </Dialog.Trigger>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Description>{description}</Dialog.Description>
      <Dialog.Content>Content</Dialog.Content>
      <Dialog.Action close onClick={onConfirm}>
        Confirm
      </Dialog.Action>
      <Dialog.Action variant="secondary" close>
        Cancel
      </Dialog.Action>
    </Dialog.Root>
  ),
  args: {
    onConfirm: fn(),
    onOpenChange: fn(),
  },
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
