import { Button } from '@repo/ui-kit/components/button'
import { Dialog } from '@repo/ui-kit/components/dialog'
import { Text } from '@repo/ui-kit/components/text'
import { headers } from 'next/headers'
import { RedirectType, redirect } from 'next/navigation'
import type { FC } from 'react'
import { authServer, authenticateOrNull } from '#shared/auth-server'
import { BackButton } from '#shared/components/back-button'

export const SignOutScreen: FC = async () => {
  const signedIn = (await authenticateOrNull()) !== null

  if (!signedIn) {
    redirect('/', RedirectType.replace)
  }

  return (
    <Dialog.Root open>
      <Dialog.Title>Sign out</Dialog.Title>
      <Dialog.Description>Are you sure you want to sign out?</Dialog.Description>
      <Dialog.Content closable={false} className="space-y-2">
        <Text className="block">You will loose your current session</Text>
        <div className="flex gap-2">
          <form
            action={async () => {
              'use server'
              await authServer.api.signOut({ headers: await headers() })
            }}
          >
            <Button type="submit" variant="destructive">
              Sign out
            </Button>
          </form>
          <BackButton variant="outline" fallbackPath="/">
            Cancel
          </BackButton>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
