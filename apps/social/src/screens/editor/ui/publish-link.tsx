import { Button } from '@repo/ui-kit/components/button'
import { RadioTowerIcon } from '@repo/ui-kit/icons'
import Link from 'next/link'
import type { FC } from 'react'

type Props = {
  projectId: string
}

export const PublishLink: FC<Props> = props => {
  const { projectId } = props

  return (
    <Button asChild variant="ghost" className="p-2">
      <Link href={`/projects/${projectId}/publish`}>
        <RadioTowerIcon />
      </Link>
    </Button>
  )
}
