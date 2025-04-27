import { Card } from '@repo/ui-kit/components/card'
import { Heading } from '@repo/ui-kit/components/heading'
import Link from 'next/link'
import type { FC } from 'react'
import { Avatar } from '#shared/components/avatar'
import type { getSubscriptions } from '../api'

type Props = {
  author: Awaited<ReturnType<typeof getSubscriptions>>['subscriptions'][number]
}

export const AuthorCard: FC<Props> = props => {
  const { author } = props

  return (
    <Link href={`/authors/${author.id}`} prefetch={false}>
      <Card.Root className="w-min">
        <Card.Content className="flex items-center gap-2">
          <Avatar.Root>
            <Avatar.Image src={author.avatar} />
            <Avatar.Fallback userName={author.name} />
          </Avatar.Root>
          <Heading.Root>
            <Heading.Title>{author.name}</Heading.Title>
          </Heading.Root>
        </Card.Content>
      </Card.Root>
    </Link>
  )
}
