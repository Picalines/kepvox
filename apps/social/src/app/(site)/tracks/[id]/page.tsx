import { Button } from '@repo/ui-kit/components/button'
import { Text } from '@repo/ui-kit/components/text'
import type { FC } from 'react'
import { getPublication } from './get-publication'
import { listenPublication } from './listen-publication'
import { reactToPublication } from './react-to-publication'

type Props = {
  params: Promise<{ id: string }>
}

const TrackPage: FC<Props> = async props => {
  const { params } = props

  const { id: publicationId } = await params

  const publicationData = await getPublication({ publication: { id: publicationId } })

  return (
    <>
      <form
        action={async () => {
          'use server'
          await listenPublication({ publication: { id: publicationId } })
        }}
      >
        <Button type="submit">Listen</Button>
      </form>
      <form
        action={async () => {
          'use server'
          await reactToPublication({ publication: { id: publicationId }, reaction: { isPositive: true } })
        }}
      >
        <Button type="submit">Like</Button>
      </form>
      <form
        action={async () => {
          'use server'
          await reactToPublication({ publication: { id: publicationId }, reaction: { isPositive: false } })
        }}
      >
        <Button type="submit">Dislike</Button>
      </form>
      <div>
        <Text>
          <pre>{JSON.stringify(publicationData, null, 2)}</pre>
        </Text>
      </div>
    </>
  )
}

export default TrackPage
