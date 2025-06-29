import type { FC, ReactNode } from 'react'
import { SiteSidebar } from '#widgets/site-sidebar'

type Props = {
  children: ReactNode
}

const SiteLayout: FC<Props> = async props => {
  const { children } = props

  return (
    <div className="flex h-dvh w-dvw">
      <SiteSidebar />
      <main className="grow overflow-auto p-4">{children}</main>
    </div>
  )
}

export default SiteLayout
