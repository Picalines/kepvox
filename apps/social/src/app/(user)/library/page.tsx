'use server'

import { Text } from '@repo/ui-kit/components/text'
import type { FC } from 'react'
import { getReactions } from './get-reactions'

const LibraryPage: FC = async () => {
  const reactionsData = await getReactions()

  return (
    <Text>
      <pre>{JSON.stringify(reactionsData, null, 2)}</pre>
    </Text>
  )
}

export default LibraryPage
