import { Skeleton } from '@repo/ui-kit/components/skeleton'
import { type FC, Suspense } from 'react'
import { ThemeSwitcher } from '#shared/components/theme-switcher'
import { AccountLink } from './account-link'
import { LandingLogo } from './landing-logo'
import { SiteEntrypoint } from './site-entrypoint'

export const LandingScreen: FC = () => {
  return (
    <main className="w-full">
      <div className="sticky top-0 flex border-b p-2">
        <Suspense fallback={<Skeleton />}>
          <AccountLink />
        </Suspense>
        <div className="inline flex-grow" />
        <ThemeSwitcher variant="ghost" className="p-2" />
      </div>
      <div className="relative h-[60vh]">
        <LandingLogo className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2" />
      </div>
      <div className="mx-auto w-min">
        <SiteEntrypoint />
      </div>
    </main>
  )
}
