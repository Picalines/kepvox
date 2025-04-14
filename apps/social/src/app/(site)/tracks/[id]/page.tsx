import type { FC } from 'react'
import { ViewPublicationScreen } from '#screens/view-publication'

type Props = {
  params: Promise<{ id: string }>
}

const TrackPage: FC<Props> = async props => {
  const { params } = props

  const { id: publicationId } = await params

  return <ViewPublicationScreen publicationId={publicationId} />
}

export default TrackPage
