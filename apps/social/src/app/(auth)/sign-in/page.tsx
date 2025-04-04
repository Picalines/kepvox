'use client'

import { Button } from '@repo/ui-kit/components/button'
import { Loader } from '@repo/ui-kit/components/loader'
import { useRouter } from 'next/navigation'
import { type FC, useCallback, useEffect } from 'react'
import { authClient } from '#shared/auth-client'

const SignInPage: FC = () => {
  const router = useRouter()
  const { isPending, data } = authClient.useSession()

  const onLogin = useCallback(async () => {
    await authClient.signIn.social({ provider: 'github' })
  }, [])

  useEffect(() => {
    if (data) {
      router.push('/account')
    }
  }, [data, router])

  if (data || isPending) {
    return <Loader />
  }

  return <Button onClick={onLogin}>Login with GitHub</Button>
}

export default SignInPage
