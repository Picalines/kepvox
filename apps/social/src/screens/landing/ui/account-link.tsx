'use client'

import { Button } from '@repo/ui-kit/components/button'
import Link from 'next/link'
import type { FC } from 'react'
import { authClient } from '#shared/auth-client'
import { Avatar } from '#shared/components/avatar'

export const AccountLink: FC = () => {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return null
  }

  if (!session) {
    return (
      <Button asChild variant="ghost" className="fade-in-0 animate-in">
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
    <Button asChild variant="ghost" className="fade-in-0 animate-in p-2">
      <Link href="/profile" prefetch={false}>
        <Avatar.Root className="size-6">
          <Avatar.Image src={avatar} />
          <Avatar.Fallback userName={userName} />
        </Avatar.Root>
      </Link>
    </Button>
  )
}
