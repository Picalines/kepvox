'use client'

import type { OmitExisting, Overlay } from '@repo/common/typing'
import { Button } from '@repo/ui-kit/components/button'
import { ArrowLeftIcon } from '@repo/ui-kit/icons'
import { useRouter } from 'next/navigation'
import type { ComponentProps, FC } from 'react'

type Props = Overlay<OmitExisting<ComponentProps<typeof Button>, 'onClick'>, { fallbackPath: string }>

export const BackButton: FC<Props> = props => {
  const { fallbackPath, children, ...buttonProps } = props

  const { back, replace } = useRouter()

  const onClick = () => {
    if (window.history.length > 1) {
      back()
    } else {
      replace(fallbackPath)
    }
  }

  return (
    <Button {...buttonProps} onClick={onClick}>
      {children ? children : <ArrowLeftIcon />}
    </Button>
  )
}
