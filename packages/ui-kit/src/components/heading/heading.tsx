import type { SetRequired } from '@repo/common/typing'
import { type ComponentProps, forwardRef } from 'react'
import { cn } from '#lib/classnames'
import { createSlot, useSlots } from '#lib/slots'
import { Text, type TextProps } from '../text'

export type SuperTitleProps = SetRequired<TextProps, 'children'>
export type TitleProps = SetRequired<TextProps, 'children'>
export type DescriptionProps = SetRequired<TextProps, 'children'>

export const SuperTitle = createSlot({ name: 'SuperTitle' }).component<SuperTitleProps>()
export const Title = createSlot({ name: 'Title' }).component<TitleProps>()
export const Description = createSlot({ name: 'Description' }).component<DescriptionProps>()

export type RootProps = SetRequired<ComponentProps<'div'>, 'children'>

export const Root = forwardRef<HTMLDivElement, RootProps>((props, ref) => {
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
    <div {...rootProps} ref={ref} className={cn('flex flex-col', className)}>
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
})
