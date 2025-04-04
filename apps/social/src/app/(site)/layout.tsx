import { Loader } from '@repo/ui-kit/components/loader'
import { Tooltip } from '@repo/ui-kit/components/tooltip'
import { type FC, type ReactNode, Suspense } from 'react'
import { SiteSidebar } from '#widgets/site-sidebar'

type Props = {
  children: ReactNode
}

const SiteLayout: FC<Props> = async props => {
  const { children } = props

  return (
    <Tooltip.Provider>
      <div className="flex h-dvh w-dvw">
        <SiteSidebar />
        <main className="grow overflow-auto p-2">
          <Suspense fallback={<Loader centered />}>{children}</Suspense>
        </main>
      </div>
    </Tooltip.Provider>
  )
}

export default SiteLayout
