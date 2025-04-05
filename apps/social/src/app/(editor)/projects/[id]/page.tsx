import type { FC } from 'react'
import { EditorScreen } from '#screens/editor'

type Props = {
  params: Promise<{ id: string }>
}

const ProjectPage: FC<Props> = async props => {
  const { params } = props

  const { id: projectId } = await params

  return <EditorScreen projectId={projectId} />
}

export default ProjectPage
