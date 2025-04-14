import type { FC } from 'react'
import { PublishProjectScreen } from '#screens/publish-project'
import { authenticateOrRedirect } from '#shared/auth-server'

type Props = {
  params: Promise<{ id: string }>
}

const PublishPage: FC<Props> = async props => {
  const { params } = props

  await authenticateOrRedirect()

  const { id: projectId } = await params

  return <PublishProjectScreen projectId={projectId} />
}

export default PublishPage
