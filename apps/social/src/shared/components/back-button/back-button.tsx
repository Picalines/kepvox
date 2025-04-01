'use client'

import type { OmitExisting } from '@repo/common/typing'
import { Button } from '@repo/ui-kit/components/button'
import { ArrowLeftIcon } from '@repo/ui-kit/icons'
import { useRouter } from 'next/navigation'
import type { ComponentProps, FC } from 'react'

type Props = OmitExisting<ComponentProps<typeof Button>, 'onClick'>

export const BackButton: FC<Props> = props => {
  const { back } = useRouter()

  return (
    <Button {...props} onClick={back}>
      <ArrowLeftIcon />
    </Button>
  )
}
