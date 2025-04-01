'use server'

import { Text } from '@repo/ui-kit/components/text'
import type { FC } from 'react'
import { getPublication } from './get-publication'

type Props = {
  params: Promise<{ id: string }>
}

const TrackPage: FC<Props> = async props => {
  const { params } = props

  const { id: publicationId } = await params

  const { publication, author, project } = await getPublication({ publication: { id: publicationId } })

  return (
    <Text>
      <pre>{JSON.stringify({ publication, author, project }, null, 2)}</pre>
    </Text>
  )
}

export default TrackPage
