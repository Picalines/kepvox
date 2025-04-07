import { Text } from '@repo/ui-kit/components/text'
import type { FC } from 'react'
import { getReactions } from './get-reactions'
import { getSubscriptions } from './get-subscriptions'

const LibraryPage: FC = async () => {
  const reactionsData = await getReactions()

  const subscriptions = await getSubscriptions()

  return (
    <>
      <div>
        <Text>
          <pre>{JSON.stringify(reactionsData, null, 2)}</pre>
        </Text>
      </div>
      <div>
        <Text>
          <pre>{JSON.stringify(subscriptions, null, 2)}</pre>
        </Text>
      </div>
    </>
  )
}

export default LibraryPage
