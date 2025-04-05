'use server'

import Link from 'next/link'
import type { FC } from 'react'
import { authenticateOrNull } from '#shared/auth-server'
import { Avatar } from '#shared/components/avatar'

type Props = {
  className?: string
}

export const AccountLink: FC<Props> = async props => {
  const { className } = props

  const session = await authenticateOrNull()

  if (!session) {
    return (
      <Link href="/sign-in" prefetch={false} className={className}>
        Sign in
      </Link>
    )
  }

  const {
    user: { name: userName, image: avatar },
  } = session

  return (
    <Link href="/profile" prefetch={false} className={className}>
      <Avatar.Root className="size-6">
        <Avatar.Image src={avatar} />
        <Avatar.Fallback userName={userName} />
      </Avatar.Root>
    </Link>
  )
}
