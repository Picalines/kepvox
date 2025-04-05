'use server'

import { DoorOpenIcon, UserIcon } from '@repo/ui-kit/icons'
import type { FC } from 'react'
import { authenticateOrNull } from '#shared/auth-server'
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
    user: { name: username, image: avatar },
  } = session

  return (
    <SidebarLink
      href="/profile"
      icon={avatar ? <img src={avatar} alt={`${username}'s avatar`} className="rounded-full" /> : <UserIcon />}
    >
      Profile
    </SidebarLink>
  )
}
