import { Separator } from '@repo/ui-kit/components/separator'
import { Skeleton } from '@repo/ui-kit/components/skeleton'
import { AudioWaveformIcon, HeartIcon, RadioTowerIcon, UserIcon } from '@repo/ui-kit/icons'
import { type FC, Suspense } from 'react'
import { ThemeSwitcher } from '#shared/components/theme-switcher'
import { SiteLogo } from '#shared/icons'
import { AccountSidebarLink } from './account-sidebar-link'
import { SidebarLink } from './sidebar-link'

export const SiteSidebar: FC = () => {
  return (
    <aside className="flex w-20 flex-col gap-2 border-r p-2">
      <SidebarLink href="/" icon={<SiteLogo />} />
      <Separator />
      <SidebarLink href="/tracks" icon={<RadioTowerIcon />}>
        Tracks
      </SidebarLink>
      <SidebarLink href="/authors" icon={<UserIcon />}>
        Authors
      </SidebarLink>
      <SidebarLink href="/library" icon={<HeartIcon />}>
        Library
      </SidebarLink>
      <SidebarLink href="/projects" icon={<AudioWaveformIcon />}>
        My Projects
      </SidebarLink>
      <div className="flex-grow" />
      <Suspense fallback={<Skeleton className="h-10 w-full" />}>
        <AccountSidebarLink />
      </Suspense>
      <ThemeSwitcher variant="ghost" />
    </aside>
  )
}
