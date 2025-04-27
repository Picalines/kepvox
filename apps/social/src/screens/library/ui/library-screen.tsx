'use server'

import { Heading } from '@repo/ui-kit/components/heading'
import { Text } from '@repo/ui-kit/components/text'
import type { FC } from 'react'
import { getReactions, getSubscriptions } from '../api'
import { AuthorCard } from './author-card'
import { PublicationCard } from './publication-card'

export const LibraryScreen: FC = async () => {
  const [{ reactions }, { subscriptions }] = await Promise.all([getReactions(), getSubscriptions()])

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Heading.Root>
          <Heading.Title>You've liked</Heading.Title>
        </Heading.Root>
        <div className="flex flex-wrap gap-2">
          {reactions.positive.length === 0 && <Text color="muted">Nothing... Yet!</Text>}
          {reactions.positive.map(publication => (
            <PublicationCard key={publication.id} publication={publication} />
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <Heading.Root>
          <Heading.Title>Subscriptions</Heading.Title>
        </Heading.Root>
        <div className="flex flex-wrap gap-2">
          {subscriptions.length === 0 && <Text color="muted">Nothing... Yet!</Text>}
          {subscriptions.map(author => (
            <AuthorCard key={author.id} author={author} />
          ))}
        </div>
      </div>
    </div>
  )
}
