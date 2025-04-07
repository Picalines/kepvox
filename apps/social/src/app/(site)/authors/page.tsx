import { Text } from '@repo/ui-kit/components/text'
import type { FC } from 'react'
import { searchAuthors } from './search-authors'

type Props = {
  searchParams?: Promise<{ name?: string }>
}

const AuthorsPage: FC<Props> = async props => {
  const { searchParams } = props

  const { name = '' } = (await searchParams) ?? {}

  const authorsData = await searchAuthors({ namePart: name })

  return (
    <Text>
      <pre>{JSON.stringify(authorsData, null, 2)}</pre>
    </Text>
  )
}

export default AuthorsPage
