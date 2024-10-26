import { cn } from '~/lib/classnames'
import { createSlot, useSlots } from '~/lib/slots'
import { type ComponentProps, forwardRef } from 'react'
import { Text, type TextProps } from '../text'

type SuperTitleProps = TextProps
type TitleProps = TextProps
type DescriptionProps = TextProps

const SuperTitle = createSlot<SuperTitleProps>('SuperTitle')
const Title = createSlot<TitleProps>('Title')
const Description = createSlot<DescriptionProps>('Description')

type RootProps = ComponentProps<'div'>

const Root = forwardRef<HTMLDivElement, RootProps>((props, ref) => {
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

const Heading = Object.assign(Root, {
  SuperTitle,
  Title,
  Description,
})

Heading.displayName = 'Heading'

export {
  Heading,
  type RootProps as HeadingProps,
  type SuperTitleProps as HeaderSuperTitleProps,
  type TitleProps as HeaderTitleProps,
  type DescriptionProps as HeaderDescriptionProps,
}
