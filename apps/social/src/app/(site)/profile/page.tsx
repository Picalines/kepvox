'use server'

import { buttonVariants } from '@repo/ui-kit/components/button'
import { Text } from '@repo/ui-kit/components/text'
import Link from 'next/link'
import type { FC } from 'react'
import { authenticateOrRedirect } from '#shared/auth-server'

const AccountPage: FC = async () => {
  const { user } = await authenticateOrRedirect()

  return (
    <>
      <div>
        <Text>Current user: {user.name}</Text>
      </div>
      <Link href="/projects" prefetch={false} className={buttonVariants()}>
        Projects
      </Link>
      <Link href="/sign-out" prefetch={false} className={buttonVariants()}>
        Sign out
      </Link>
    </>
  )
}

export default AccountPage
