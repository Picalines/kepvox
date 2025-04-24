import { Skeleton } from '@repo/ui-kit/components/skeleton'
import type { FC } from 'react'

export const EditorScreenSkeleton: FC = () => {
  return (
    <div className="flex h-dvh flex-col">
      <div className="flex h-16 gap-2 border-b p-2">
        <Skeleton className="aspect-square h-full" />
        <Skeleton className="h-full w-40" />
        <div className="grow" />
        <Skeleton className="aspect-square h-full" />
        <Skeleton className="aspect-square h-full" />
      </div>
      <div className="flex grow flex-col gap-2 p-2">
        <Skeleton className="grow" />
        <div className="flex grow gap-2">
          <Skeleton className="basis-[25%]" />
          <Skeleton className="grow" />
        </div>
      </div>
    </div>
  )
}
