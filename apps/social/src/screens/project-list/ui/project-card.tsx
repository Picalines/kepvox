import { cn } from '@repo/ui-kit/classnames'
import { Button, type ButtonVariant } from '@repo/ui-kit/components/button'
import { Card } from '@repo/ui-kit/components/card'
import { Heading } from '@repo/ui-kit/components/heading'
import { PencilIcon, RadioTowerIcon } from '@repo/ui-kit/icons'
import Link from 'next/link'
import type { ComponentType, FC } from 'react'
import { RelativeDate } from '#shared/components/relative-date'

type Props = {
  id: string
  name: string
  description: string
  updatedAt: Date
  publicationId: string | null
}

export const ProjectCard: FC<Props> = props => {
  const { id, name, description, updatedAt, publicationId } = props

  return (
    <Card.Root className="min-h-40 w-min min-w-60">
      <Card.Header>
        <Heading.Root>
          <Heading.Title>{name}</Heading.Title>
          <Heading.Description>
            <RelativeDate date={updatedAt} suffix />
          </Heading.Description>
        </Heading.Root>
      </Card.Header>
      <Card.Content>{description}</Card.Content>
      <Card.Footer className="flex">
        <FooterLink href={`/projects/${id}`} variant="outline" Icon={PencilIcon} />
        <div className="grow" />
        {publicationId && <FooterLink href={`/tracks/${publicationId}`} variant="primary" Icon={RadioTowerIcon} />}
      </Card.Footer>
    </Card.Root>
  )
}

type FooterLinkProps = {
  href: string
  variant: ButtonVariant
  Icon: ComponentType<{ className?: string }>
}

const FooterLink: FC<FooterLinkProps> = props => {
  const { href, variant, Icon } = props

  return (
    <Button asChild variant={variant} size="sm" className="p-1">
      <Link href={href} prefetch={false} className={cn('p-1')}>
        <Icon className="h-4" />
      </Link>
    </Button>
  )
}
