import { Button } from '@repo/ui-kit/components/button'
import Link from 'next/link'
import type { FC } from 'react'

export const SiteEntrypoint: FC = async () => {
  return (
    <div className="flex gap-2">
      <Button asChild variant="outline">
        <Link href="/tracks" prefetch={false}>
          Explore
        </Link>
      </Button>
      <Button asChild variant="outline">
        <Link href="/projects" prefetch={false}>
          Create
        </Link>
      </Button>
    </div>
  )
}
