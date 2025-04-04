'use server'
import { UserIcon } from '@repo/ui-kit/icons'
import Link from 'next/link'
import type { FC } from 'react'
import { authenticateOrNull } from '#shared/auth-server'

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
    user: { name: username, image: avatar },
  } = session

  return (
    <Link href="/account" prefetch={false} className={className}>
      {avatar ? <img src={avatar} alt={`${username}'s avatar`} className="size-full rounded-full" /> : <UserIcon />}
    </Link>
  )
}
