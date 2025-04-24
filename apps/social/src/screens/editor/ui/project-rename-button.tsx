'use client'

import { Button } from '@repo/ui-kit/components/button'
import { Dialog } from '@repo/ui-kit/components/dialog'
import { TextInput } from '@repo/ui-kit/components/text-input'
import { PencilIcon } from '@repo/ui-kit/icons'
import { invoke } from '@withease/factories'
import { useUnit } from 'effector-react'
import { useRouter } from 'next/navigation'
import { type ComponentProps, type FC, useState } from 'react'
import { createProjectRenameForm } from '../model'

const renameForm = invoke(createProjectRenameForm)

type Props = ComponentProps<typeof Button> & {
  project: {
    id: string
    name: string
    description: string
  }
}

export const ProjectRenameButton: FC<Props> = props => {
  const { project, ...buttonProps } = props

  const { name, description, onNameChange, onDescriptionChange } = useUnit({
    name: renameForm.$name,
    description: renameForm.$description,
    onNameChange: renameForm.userChangedName,
    onDescriptionChange: renameForm.userChangedDescription,
  })

  const [opened, setOpened] = useState(false)

  const { refresh } = useRouter()

  return (
    <>
      {opened && <renameForm.gate project={project} refresh={refresh} />}
      <Dialog.Root open={opened} onOpenChange={setOpened}>
        <Dialog.Trigger>
          <Button {...buttonProps}>
            <PencilIcon />
          </Button>
        </Dialog.Trigger>
        <Dialog.Title>Update Information</Dialog.Title>
        <Dialog.Description>The information will be used for publication</Dialog.Description>
        <Dialog.Content className="space-y-4 py-2">
          <TextInput.Root value={name} onValueChange={onNameChange}>
            <TextInput.Label>Name</TextInput.Label>
          </TextInput.Root>
          <TextInput.Root value={description} onValueChange={onDescriptionChange}>
            <TextInput.Label>Description</TextInput.Label>
          </TextInput.Root>
        </Dialog.Content>
      </Dialog.Root>
    </>
  )
}
