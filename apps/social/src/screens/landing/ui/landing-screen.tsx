import type { FC } from 'react'
import { ThemeSwitcher } from '#shared/components/theme-switcher'
import { AccountLink } from './account-link'
import { LandingLogo } from './landing-logo'
import { SiteEntrypoint } from './site-entrypoint'

export const LandingScreen: FC = () => {
  return (
    <main className="w-full">
      <div className="fade-in-0 sticky top-0 flex animate-in border-b p-2 duration-200">
        <AccountLink />
        <div className="inline flex-grow" />
        <ThemeSwitcher variant="ghost" />
      </div>
      <div className="relative h-[60vh]">
        <LandingLogo className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2" />
      </div>
      <div className="fade-in-0 slide-in-from-bottom-2 mx-auto w-min animate-in fill-mode-both transition-transform delay-400 duration-400">
        <SiteEntrypoint />
      </div>
    </main>
  )
}
