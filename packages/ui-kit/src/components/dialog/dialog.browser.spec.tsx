import { expect, test } from 'vitest'
import { render } from 'vitest-browser-react'
import { Button } from '#components/button'
import { Dialog } from '.'

test('content should be visible after the trigger was clicked', async () => {
  const screen = render(
    <Dialog.Root>
      <Dialog.Trigger>
        <Button>Trigger</Button>
      </Dialog.Trigger>
      <Dialog.Title>Title</Dialog.Title>
      <Dialog.Description>Description</Dialog.Description>
      <Dialog.Content>Content</Dialog.Content>
    </Dialog.Root>,
  )

  await screen.getByText('Trigger').click()

  await expect.element(screen.getByText('Content')).toBeVisible()
})

test('content should not be visible after close button was clicked', async () => {
  const screen = render(
    <Dialog.Root>
      <Dialog.Trigger>
        <Button>Trigger</Button>
      </Dialog.Trigger>
      <Dialog.Title>Title</Dialog.Title>
      <Dialog.Description>Description</Dialog.Description>
      <Dialog.Content>Content</Dialog.Content>
    </Dialog.Root>,
  )

  await screen.getByText('Trigger').click()
  await screen.getByText('Close').click()
  await expect.element(screen.getByText('Content')).not.toBeInTheDocument()
})
