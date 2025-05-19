'use server'

import { Button } from '@repo/ui-kit/components/button'
import { Heading } from '@repo/ui-kit/components/heading'
import type { FC } from 'react'
import { Avatar } from '#shared/components/avatar'
import { getAuthor, subscribeToAuthor, unsubscribeFromAuthor } from '../api'
import { PublicationCard } from './publication-card'

type Props = {
  id: string
}

export const AuthorScreen: FC<Props> = async (props: Props) => {
  const { id } = props

  const { author, publications } = await getAuthor({ author: { id } })

  const toggleSubscription = (author.subscribed ? unsubscribeFromAuthor : subscribeToAuthor).bind(null, {
    author: { id },
  })

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Avatar.Root className="size-20">
            <Avatar.Image src={author.avatar} />
            <Avatar.Fallback userName={author.name} />
          </Avatar.Root>
          <Heading.Root>
            <Heading.Title>{author.name}</Heading.Title>
            <Heading.Description>
              <form action={toggleSubscription}>
                <Button type="submit" size="sm" disabled={author.isMe}>
                  {author.subscribed ? <>Unsubscribe</> : <>Subscribe</>}
                </Button>
              </form>
            </Heading.Description>
          </Heading.Root>
        </div>
      </div>
      <div className="space-y-2">
        <Heading.Root>
          <Heading.Title>Publications</Heading.Title>
        </Heading.Root>
        <div className="flex flex-wrap gap-2">
          {publications.map(publication => (
            <PublicationCard key={publication.id} publication={publication} />
          ))}
        </div>
      </div>
    </div>
  )
}
