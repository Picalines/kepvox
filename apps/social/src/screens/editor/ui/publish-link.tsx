import { cn } from '@repo/ui-kit/classnames'
import { buttonVariants } from '@repo/ui-kit/components/button'
import { RadioTowerIcon } from '@repo/ui-kit/icons'
import Link from 'next/link'
import type { FC } from 'react'

type Props = {
  projectId: string
}

export const PublishLink: FC<Props> = props => {
  const { projectId } = props

  return (
    <Link href={`/projects/${projectId}/publish`} className={cn(buttonVariants({ variant: 'ghost' }), 'p-2')}>
      <RadioTowerIcon />
    </Link>
  )
}
