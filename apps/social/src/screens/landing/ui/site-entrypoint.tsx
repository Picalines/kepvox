import { buttonVariants } from '@repo/ui-kit/components/button'
import Link from 'next/link'
import type { FC } from 'react'

export const SiteEntrypoint: FC = async () => {
  return (
    <div className="flex gap-2">
      <Link href="/tracks" className={buttonVariants({ variant: 'outline' })} prefetch={false}>
        Explore
      </Link>
      <Link href="/projects" className={buttonVariants({ variant: 'outline' })} prefetch={false}>
        Create
      </Link>
    </div>
  )
}
