import { Button } from '@repo/ui-kit/components/button'
import { Dialog } from '@repo/ui-kit/components/dialog'
import type { FC } from 'react'
import { BackButton } from '#shared/components/back-button'
import { publishProject } from '../api'

type Props = {
  projectId: string
}

export const PublishProjectScreen: FC<Props> = props => {
  const { projectId } = props

  return (
    <Dialog.Root open>
      <Dialog.Title>Publish project</Dialog.Title>
      <Dialog.Description>Are you sure?</Dialog.Description>
      <Dialog.Content closable={false} className="flex gap-2">
        <form
          action={async () => {
            'use server'
            await publishProject({ project: { id: projectId } })
          }}
        >
          <Button variant="primary">Publish</Button>
        </form>
        <BackButton fallbackPath={`/projects/${projectId}`} variant="outline">
          Cancel
        </BackButton>
      </Dialog.Content>
    </Dialog.Root>
  )
}
