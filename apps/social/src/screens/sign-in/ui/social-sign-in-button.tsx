'use client'

import { Button } from '@repo/ui-kit/components/button'
import { Loader } from '@repo/ui-kit/components/loader'
import { type FC, type ReactNode, useReducer } from 'react'
import { authClient } from '#shared/auth-client'

type SocialSignInProvider = Parameters<(typeof authClient)['signIn']['social']>[0]['provider']

type Props = {
  provider: SocialSignInProvider
  children: ReactNode
}

export const SocialSignInButton: FC<Props> = props => {
  const { provider, children } = props

  const [isPending, startPending] = useReducer(() => true, false)

  const onClick = () => {
    startPending()
    authClient.signIn.social({ provider, callbackURL: '/library' })
  }

  return (
    <Button onClick={onClick} disabled={isPending} variant="outline" className="w-full">
      {isPending ? <Loader centered /> : children}
    </Button>
  )
}
