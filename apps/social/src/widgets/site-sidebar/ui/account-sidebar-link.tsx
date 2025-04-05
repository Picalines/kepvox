'use server'

import { DoorOpenIcon } from '@repo/ui-kit/icons'
import type { FC } from 'react'
import { authenticateOrNull } from '#shared/auth-server'
import { Avatar } from '#shared/components/avatar'
import { SidebarLink } from './sidebar-link'

export const AccountSidebarLink: FC = async () => {
  const session = await authenticateOrNull()

  if (!session) {
    return (
      <SidebarLink href="/sign-in" icon={<DoorOpenIcon />}>
        Sign In
      </SidebarLink>
    )
  }

  const {
    user: { name: userName, image: avatar },
  } = session

  return (
    <SidebarLink
      href="/profile"
      icon={
        <Avatar.Root className="size-6">
          <Avatar.Image src={avatar} />
          <Avatar.Fallback userName={userName} />
        </Avatar.Root>
      }
    >
      Profile
    </SidebarLink>
  )
}
