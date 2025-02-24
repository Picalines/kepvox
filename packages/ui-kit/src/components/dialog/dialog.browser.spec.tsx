import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { Button } from '#components/button'
import { Dialog } from '.'

it('should open when the trigger is clicked', async () => {
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
