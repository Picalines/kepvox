'use client'

import * as RadixDialog from '@radix-ui/react-dialog'
import type { FC, ReactNode } from 'react'

type Props = {
  children: ReactNode
  overlayClosable: boolean
  className: string
}

type OnInteractOutside = NonNullable<RadixDialog.DialogContentProps['onInteractOutside']>

const preventClosing: OnInteractOutside = event => event.preventDefault()

export const DialogContent: FC<Props> = props => {
  const { children, overlayClosable, className } = props

  return (
    <RadixDialog.Content
      className={className}
      onInteractOutside={overlayClosable ? undefined : preventClosing}
      onPointerDownOutside={overlayClosable ? undefined : preventClosing}
    >
      {children}
    </RadixDialog.Content>
  )
}
