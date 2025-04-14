import { Card } from '@repo/ui-kit/components/card'
import { Heading } from '@repo/ui-kit/components/heading'
import { Text } from '@repo/ui-kit/components/text'
import Link from 'next/link'
import type { FC } from 'react'
import { Avatar } from '#shared/components/avatar'
import type { searchPublications } from '../api'

type Props = {
  publication: Awaited<ReturnType<typeof searchPublications>>['publications'][number]
}

export const PublicationCard: FC<Props> = props => {
  const { publication } = props

  return (
    <Link href={`/tracks/${publication.id}`} prefetch={false}>
      <Card.Root className="hover:-translate-y-1 relative min-h-40 w-min min-w-60 shadow-background shadow-md transition-all hover:shadow-accent">
        <Card.Header>
          <Heading.Root>
            <Heading.Title>{publication.name}</Heading.Title>
            <Heading.Description>{publication.description}</Heading.Description>
          </Heading.Root>
        </Card.Header>
        <Card.Footer className="flex items-center gap-2">
          <Avatar.Root>
            <Avatar.Image src={publication.author.avatar} />
            <Avatar.Fallback userName={publication.author.name} />
          </Avatar.Root>
          <Text variant="text-s" color="muted">
            {publication.author.name}
          </Text>
        </Card.Footer>
      </Card.Root>
    </Link>
  )
}
