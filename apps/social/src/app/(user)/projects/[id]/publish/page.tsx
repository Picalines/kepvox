import { Button } from '@repo/ui-kit/components/button'
import { Text } from '@repo/ui-kit/components/text'
import type { FC } from 'react'
import { authenticateOrRedirect } from '#shared/auth-server'
import { BackButton } from '#shared/components/back-button'
import { publishProject } from './publish-project'

type Props = {
  params: Promise<{ id: string }>
}

const PublishPage: FC<Props> = async props => {
  const { params } = props

  await authenticateOrRedirect()

  const { id: projectId } = await params

  return (
    <>
      <div>
        <BackButton />
      </div>
      <div>
        <Text>Are you sure?</Text>
      </div>
      <form
        action={async () => {
          'use server'
          await publishProject({ project: { id: projectId } })
        }}
      >
        <Button>Publish</Button>
      </form>
    </>
  )
}

export default PublishPage
