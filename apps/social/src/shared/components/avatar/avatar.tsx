import * as RadixAvatar from '@radix-ui/react-avatar'
import { cn } from '@repo/ui-kit/classnames'
import { createSlot, useSlots } from '@repo/ui-kit/slots'
import type { FC, ReactNode } from 'react'

type RootProps = {
  children: ReactNode
  className?: string
}

type ImageProps = {
  src: string | null | undefined
}

type FallbackProps = {
  userName: string
}

export const Image = createSlot({ name: 'Image' }).component<ImageProps>()

export const Fallback = createSlot({ name: 'Fallback', required: true }).component<FallbackProps>()

export const Root: FC<RootProps> = props => {
  const { children, className } = props

  const { image, fallback } = useSlots(children, { image: Image, fallback: Fallback })

  return (
    <RadixAvatar.Root className={cn('relative flex size-6 shrink-0 overflow-hidden rounded-full', className)}>
      {image?.props.src && <RadixAvatar.Image src={image.props.src} className="aspect-square size-full" />}
      <RadixAvatar.Fallback className="flex size-full items-center justify-center rounded-full bg-muted">
        {userNameAbbr(fallback.props.userName)}
      </RadixAvatar.Fallback>
    </RadixAvatar.Root>
  )
}

const userNameAbbr = (userName: string) => {
  const [first, second] = userName.split(' ', 2)
  return `${first?.[0] ?? ''}${second?.[0] ?? ''}`.toUpperCase() || '?'
}
