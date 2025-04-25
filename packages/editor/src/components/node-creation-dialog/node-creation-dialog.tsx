import { capitalize } from '@repo/common/string'
import { Command } from '@repo/ui-kit/components/command'
import { Dialog } from '@repo/ui-kit/components/dialog'
import { useUnit } from 'effector-react'
import type { FC } from 'react'
import { NODE_TYPES } from '#meta'
import { editorModel } from '#model'

export const NodeCreationDialog: FC = () => {
  const { opened, cancel, onTypeSelected } = useUnit({
    cancel: editorModel.userCancelledNodeCreation,
    onTypeSelected: editorModel.userSelectedNodeType,
    opened: editorModel.$nodeCreationDialogShown,
  })

  return (
    <Dialog.Root open={opened} onOpenChange={cancel}>
      <Dialog.Title>Create Synth node</Dialog.Title>
      <Dialog.Description>Select type</Dialog.Description>
      <Dialog.Content>
        <Command.Root>
          <Command.Input placeholder="Enter synth node type..." />
          <Command.Group>
            <Command.Label>Nodes</Command.Label>
            {NODE_TYPES.filter(type => type !== 'output').map(type => (
              <Command.Item key={type} value={type} onSelect={onTypeSelected.bind(null, { type })}>
                {capitalize(type)}
              </Command.Item>
            ))}
          </Command.Group>
        </Command.Root>
      </Dialog.Content>
    </Dialog.Root>
  )
}
