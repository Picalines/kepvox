'use server'

import { Button } from '@repo/ui-kit/components/button'
import Link from 'next/link'
import type { FC } from 'react'
import { authenticateOrNull } from '#shared/auth-server'
import { Avatar } from '#shared/components/avatar'

export const AccountLink: FC = async () => {
  const session = await authenticateOrNull()

  if (!session) {
    return (
      <Button asChild variant="ghost">
        <Link href="/sign-in" prefetch={false}>
          Sign in
        </Link>
      </Button>
    )
  }

  const {
    user: { name: userName, image: avatar },
  } = session

  return (
    <Button asChild variant="ghost" className="p-2">
      <Link href="/profile" prefetch={false}>
        <Avatar.Root className="size-6">
          <Avatar.Image src={avatar} />
          <Avatar.Fallback userName={userName} />
        </Avatar.Root>
      </Link>
    </Button>
  )
}
