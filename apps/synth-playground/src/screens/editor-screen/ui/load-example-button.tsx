'use client'

import { Button } from '@repo/ui-kit/components/button'
import { Command } from '@repo/ui-kit/components/command'
import { Dialog } from '@repo/ui-kit/components/dialog'
import { useUnit } from 'effector-react'
import type { FC } from 'react'
import { EXAMPLE_NAMES, model } from '../model'

export const LoadExampleButton: FC = () => {
  const { open, onOpenChange, onSelect } = useUnit({
    open: model.$examplesDialogShown,
    onOpenChange: model.userToggledExamplesDialog,
    onSelect: model.userSelectedAnExample,
  })

  return (
    <Dialog.Root closable open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger>
        <Button.Root size="lg" variant="outline">
          <Button.Text>Load example</Button.Text>
        </Button.Root>
      </Dialog.Trigger>
      <Dialog.Title>Select an example</Dialog.Title>
      <Dialog.Description>Current code will be lost!</Dialog.Description>
      <Dialog.Content>
        <Command.Root>
          <Command.Input />
          <Command.Group>
            <Command.Label>Examples</Command.Label>
            {EXAMPLE_NAMES.map(name => (
              <Command.Item key={name} value={name} onSelect={onSelect as (value: string) => void}>
                {name}
              </Command.Item>
            ))}
          </Command.Group>
        </Command.Root>
      </Dialog.Content>
    </Dialog.Root>
  )
}
