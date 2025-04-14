'use server'

import { Button } from '@repo/ui-kit/components/button'
import { Heading } from '@repo/ui-kit/components/heading'
import { Text } from '@repo/ui-kit/components/text'
import { CheckIcon, HeartIcon } from '@repo/ui-kit/icons'
import Link from 'next/link'
import type { FC } from 'react'
import { Avatar } from '#shared/components/avatar'
import { getPublication, reactToPublication } from '../api'
import { ProjectView } from './project-view'

type Props = {
  publicationId: string
}

export const ViewPublicationScreen: FC<Props> = async props => {
  const { publicationId } = props

  const { publication, project, author, listened, reaction } = await getPublication({
    publication: { id: publicationId },
  })

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="grid grid-cols-2 gap-4 rounded-md border p-4">
        <Heading.Root className="self-start justify-self-start">
          <Heading.Title>{publication.name}</Heading.Title>
          <Heading.Description>{publication.description}</Heading.Description>
        </Heading.Root>
        <div className="justify-self-end">{listened && <CheckIcon className="zoom-in-0 m-2 animate-in" />}</div>
        <div className="flex w-min items-center gap-2 self-end">
          <Avatar.Root>
            <Avatar.Image src={author.avatar} />
            <Avatar.Fallback userName={author.name} />
          </Avatar.Root>
          <Text>
            <Link href={`/authors/${author.id}`} prefetch={false}>
              {author.name}
            </Link>
          </Text>
        </div>
        <form
          className="justify-self-end"
          action={reactToPublication.bind(null, {
            publication: { id: publicationId },
            reaction: { isPositive: !reaction?.isPositive },
          })}
        >
          <Button variant={reaction?.isPositive ? 'primary' : 'ghost'}>
            <HeartIcon />
          </Button>
        </form>
      </div>
      <div className="grow overflow-hidden rounded-md border">
        <ProjectView publicationId={publicationId} project={project} />
      </div>
    </div>
  )
}
