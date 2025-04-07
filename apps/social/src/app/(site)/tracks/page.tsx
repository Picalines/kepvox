import { Text } from '@repo/ui-kit/components/text'
import type { FC } from 'react'
import { searchPublications } from './search-publications'

type Props = {
  searchParams?: Promise<{ name?: string }>
}

const TracksPage: FC<Props> = async props => {
  const { searchParams } = props

  const { name = '' } = (await searchParams) ?? {}

  const { publications } = await searchPublications({ namePart: name })

  return (
    <Text>
      <pre>{JSON.stringify(publications, null, 2)}</pre>
    </Text>
  )
}

export default TracksPage
