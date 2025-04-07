import { Button } from '@repo/ui-kit/components/button'
import Link from 'next/link'
import type { FC } from 'react'

export const SiteEntrypoint: FC = () => {
  return (
    <div className="flex gap-2">
      <Button asChild variant="ghost">
        <Link href="/tracks" prefetch={false}>
          Explore
        </Link>
      </Button>
      <Button asChild variant="ghost">
        <Link href="/projects" prefetch={false}>
          Create
        </Link>
      </Button>
    </div>
  )
}
