'use server'

import { Button } from '@repo/ui-kit/components/button'
import { Heading } from '@repo/ui-kit/components/heading'
import Link from 'next/link'
import type { FC } from 'react'
import { authenticateOrRedirect } from '#shared/auth-server'
import { Avatar } from '#shared/components/avatar'
import { RelativeDate } from '#shared/components/relative-date'

export const ProfileScreen: FC = async () => {
  const { user } = await authenticateOrRedirect()

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Avatar.Root className="size-20">
          <Avatar.Image src={user.image} />
          <Avatar.Fallback userName={user.name} />
        </Avatar.Root>
        <Heading.Root>
          <Heading.Title>{user.name}</Heading.Title>
          <Heading.Description>
            Joined <RelativeDate date={user.createdAt} suffix />
          </Heading.Description>
        </Heading.Root>
      </div>
      <Button asChild variant="outline">
        <Link href="/sign-out" prefetch={false}>
          Sign out
        </Link>
      </Button>
    </div>
  )
}
