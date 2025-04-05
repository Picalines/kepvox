'use server'

import { Dialog } from '@repo/ui-kit/components/dialog'
import { Text } from '@repo/ui-kit/components/text'
import Link from 'next/link'
import { RedirectType, redirect } from 'next/navigation'
import type { FC } from 'react'
import { authenticateOrNull } from '#shared/auth-server'
import { SocialSignInButton } from './social-sign-in-button'

export const SignInScreen: FC = async () => {
  const signedIn = (await authenticateOrNull()) !== null

  if (signedIn) {
    redirect('/profile', RedirectType.replace)
  }

  return (
    <Dialog.Root open>
      <Dialog.Title>Sign in</Dialog.Title>
      <Dialog.Description>
        <Link href="/">kepvox/social</Link>
      </Dialog.Description>
      <Dialog.Content closable={false} className="space-y-2">
        <Text className="block">Login to create & publish your projects</Text>
        <SocialSignInButton provider="github">GitHub</SocialSignInButton>
      </Dialog.Content>
    </Dialog.Root>
  )
}
