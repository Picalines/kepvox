import type { Overlay } from '@repo/common/typing'
import type { ComponentProps, FC, ReactNode } from 'react'
import { cn } from '#lib/classnames'
import { createSlot, useSlots } from '#lib/slots'
import { Text, type TextProps } from '../text'

export type SuperTitleProps = TextProps
export type TitleProps = TextProps
export type DescriptionProps = TextProps

export const SuperTitle = createSlot({ name: 'SuperTitle' }).component<SuperTitleProps>()
export const Title = createSlot({ name: 'Title' }).component<TitleProps>()
export const Description = createSlot({ name: 'Description' }).component<DescriptionProps>()

export type RootProps = Overlay<
  ComponentProps<'div'>,
  {
    children: ReactNode
    className?: string
    align?: 'start' | 'center' | 'end'
  }
>

export const Root: FC<RootProps> = props => {
  const { children, className, align = 'start', ...rootProps } = props

  const { superTitle, title, description } = useSlots(children, {
    superTitle: SuperTitle,
    title: Title,
    description: Description,
  })

  if (!superTitle && !title && !description) {
    return null
  }

  return (
    <div
      {...rootProps}
      className={cn(
        'flex flex-col',
        { 'text-start': align === 'start', 'text-center': align === 'center', 'text-end': align === 'end' },
        className,
      )}
    >
      {superTitle && (
        <Text variant="text-xs" color="muted" {...superTitle.props} ref={superTitle.ref}>
          {superTitle.children}
        </Text>
      )}
      {title && (
        <Text variant="heading-m" {...title.props} ref={title.ref}>
          {title.children}
        </Text>
      )}
      {description && (
        <Text variant="text-m" color="muted" {...description.props} ref={description.ref}>
          {description.children}
        </Text>
      )}
    </div>
  )
}

Root.displayName = 'Heading'
