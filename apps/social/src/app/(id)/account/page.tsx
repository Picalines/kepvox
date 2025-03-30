'use server'

import { Text } from '@repo/ui-kit/components/text'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import type { FC } from 'react'
import { authServer } from '#shared/auth-server'

const AccountPage: FC = async () => {
  const session = await authServer.api.getSession({ headers: await headers() })

  if (!session) {
    redirect('/sign-in')
  }

  return <Text>Current user: {session.user.name}</Text>
}

export default AccountPage
