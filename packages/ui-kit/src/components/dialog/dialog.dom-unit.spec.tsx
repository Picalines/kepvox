import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { expect, it } from 'vitest'
import { Button } from '#components/button'
import { Dialog } from '.'

it('should open when a Button inside Trigger is pressed', async () => {
  const user = userEvent.setup()

  render(
    <Dialog.Root>
      <Dialog.Trigger>
        <Button.Root>
          <Button.Text>test-button</Button.Text>
        </Button.Root>
      </Dialog.Trigger>
      <Dialog.Title>dialog-title</Dialog.Title>
      <Dialog.Description>dialog-description</Dialog.Description>
      <Dialog.Content>dialog-content</Dialog.Content>
    </Dialog.Root>,
  )

  await user.click(await screen.findByRole('button', { name: 'test-button' }))

  expect(await screen.findByText('dialog-content')).toBeVisible()
})

it('should not open if a Button inside Trigger prevents default behaviour', async () => {
  const user = userEvent.setup()

  render(
    <Dialog.Root>
      <Dialog.Trigger>
        <Button.Root onClick={event => event.preventDefault()}>
          <Button.Text>test-button</Button.Text>
        </Button.Root>
      </Dialog.Trigger>
      <Dialog.Title>dialog-title</Dialog.Title>
      <Dialog.Description>dialog-description</Dialog.Description>
      <Dialog.Content>dialog-content</Dialog.Content>
    </Dialog.Root>,
  )

  await user.click(await screen.findByRole('button', { name: 'test-button' }))

  expect(screen.queryByText('dialog-content')).not.toBeInTheDocument()
})
