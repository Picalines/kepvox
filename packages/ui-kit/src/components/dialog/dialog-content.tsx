'use client'

import * as RadixDialog from '@radix-ui/react-dialog'
import type { FC, ReactNode } from 'react'

type Props = {
  children: ReactNode
  closable?: boolean
  trapFocus?: boolean
  className?: string
}

type OnInteractOutside = NonNullable<RadixDialog.DialogContentProps['onInteractOutside']>

const preventClosing: OnInteractOutside = event => event.preventDefault()

export const DialogContent: FC<Props> = props => {
  const { closable, ...contentProps } = props

  return (
    <RadixDialog.Content
      {...contentProps}
      onInteractOutside={closable ? undefined : preventClosing}
      onPointerDownOutside={closable ? undefined : preventClosing}
    />
  )
}
