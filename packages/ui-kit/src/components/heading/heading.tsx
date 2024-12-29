import { type ComponentProps, forwardRef } from 'react'
import { cn } from '#lib/classnames'
import { createSlot, useSlots } from '#lib/slots'
import { Text, type TextProps } from '../text'

export type SuperTitleProps = TextProps
export type TitleProps = TextProps
export type DescriptionProps = TextProps

export const SuperTitle = createSlot<SuperTitleProps>('SuperTitle')
export const Title = createSlot<TitleProps>('Title')
export const Description = createSlot<DescriptionProps>('Description')

export type RootProps = ComponentProps<'div'>

export const Root = forwardRef<HTMLDivElement, RootProps>((props, ref) => {
  const { children, className, ...rootProps } = props

  const slots = useSlots({ children, defaultSlot: Title })

  const superTitle = slots.get(SuperTitle)
  const title = slots.get(Title)
  const description = slots.get(Description)

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
        <Text variant="text-m" color="primary" {...description.props} ref={description.ref}>
          {description.children}
        </Text>
      )}
    </div>
  )
})
