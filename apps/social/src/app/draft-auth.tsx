'use client'

import { Button } from '@repo/ui-kit/components/button'
import { Loader } from '@repo/ui-kit/components/loader'
import { Text } from '@repo/ui-kit/components/text'
import { type FC, useCallback } from 'react'
import { authClient } from '#shared/auth-client'

// TODO: draft component

export const DraftAuth: FC = () => {
  const { isPending, data } = authClient.useSession()

  const onLogin = useCallback(async () => {
    await authClient.signIn.social({ provider: 'github' })
  }, [])

  if (isPending) {
    return <Loader />
  }

  return (
    <>
      <div>{data ? <Text>Current user: {data.user.name}</Text> : <Text>No user</Text>}</div>
      <Button onClick={onLogin}>Login with GitHub</Button>
    </>
  )
}
