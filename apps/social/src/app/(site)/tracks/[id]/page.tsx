import { Button } from '@repo/ui-kit/components/button'
import { Text } from '@repo/ui-kit/components/text'
import type { FC } from 'react'
import { getPublication } from './get-publication'
import { listenPublication } from './listen-publication'

type Props = {
  params: Promise<{ id: string }>
}

const TrackPage: FC<Props> = async props => {
  const { params } = props

  const { id: publicationId } = await params

  const { publication, author, project } = await getPublication({ publication: { id: publicationId } })

  return (
    <>
      <div>
        <Text>
          <pre>{JSON.stringify({ publication, author, project }, null, 2)}</pre>
        </Text>
      </div>
      <form
        action={async () => {
          'use server'
          await listenPublication({ publication: { id: publicationId } })
        }}
      >
        <Button type="submit">Listen</Button>
      </form>
    </>
  )
}

export default TrackPage
