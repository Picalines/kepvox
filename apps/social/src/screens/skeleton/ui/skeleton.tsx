import { Skeleton } from '@repo/ui-kit/components/skeleton'
import type { FC } from 'react'

// TODO: actual design, probably

export const SkeletonScreen: FC = () => {
  return (
    <div className="flex flex-col gap-[1ch]">
      <Skeleton className="h-[1ch] w-[20ch] text-lg" />
      <Skeleton className="h-[1ch] w-[10ch]" />
      <div />
      <Skeleton className="h-40 w-60" />
    </div>
  )
}
