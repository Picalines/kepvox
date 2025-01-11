import type { SetRequired } from '@repo/common/typing'
import type { ComponentProps, FC } from 'react'
import { cn } from '#lib/classnames'
import { createSlot, useSlots } from '#lib/slots'
import { Text, type TextProps } from '../text'

export type SuperTitleProps = TextProps
export type TitleProps = TextProps
export type DescriptionProps = TextProps

export const SuperTitle = createSlot({ name: 'SuperTitle' }).component<SuperTitleProps>()
export const Title = createSlot({ name: 'Title' }).component<TitleProps>()
export const Description = createSlot({ name: 'Description' }).component<DescriptionProps>()

export type RootProps = SetRequired<ComponentProps<'div'>, 'children'>

export const Root: FC<RootProps> = props => {
  const { children, className, ...rootProps } = props

  const { superTitle, title, description } = useSlots(children, {
    superTitle: SuperTitle,
    title: Title,
    description: Description,
  })

  if (!superTitle && !title && !description) {
    return null
  }

  return (
    <div {...rootProps} className={cn('flex flex-col', className)}>
      {superTitle && (
        <Text variant="text-xs" color="secondary" {...superTitle.props} ref={superTitle.ref}>
          {superTitle.children}
        </Text>
      )}
      {title && (
        <Text variant="heading-m" color="primary" {...title.props} ref={title.ref}>
          {title.children}
        </Text>
      )}
      {description && (
        <Text variant="text-m" color="secondary" {...description.props} ref={description.ref}>
          {description.children}
        </Text>
      )}
    </div>
  )
}

Root.displayName = 'Heading'
