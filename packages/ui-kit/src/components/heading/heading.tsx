import type { FC, ReactNode } from 'react'
import { cn } from '#lib/classnames'
import { createSlot, useSlots } from '#lib/slots'
import { Text, type TextProps } from '../text'

export type RootProps = {
  children: ReactNode
  align?: 'start' | 'center' | 'end'
}

export type SuperTitleProps = {
  children: ReactNode
  color?: TextProps['color']
}

export type TitleProps = {
  children: ReactNode
  color?: TextProps['color']
}

export type DescriptionProps = {
  children: ReactNode
  color?: TextProps['color']
}

export const SuperTitle = createSlot({ name: 'SuperTitle' }).component<SuperTitleProps>()

export const Title = createSlot({ name: 'Title' }).component<TitleProps>()

export const Description = createSlot({ name: 'Description' }).component<DescriptionProps>()

export const Root: FC<RootProps> = props => {
  const { children, align = 'start', ...rootProps } = props

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
      className={cn('flex flex-col', {
        'text-start': align === 'start',
        'text-center': align === 'center',
        'text-end': align === 'end',
      })}
    >
      {superTitle && (
        <Text variant="text-xs" color="muted" {...superTitle.props}>
          {superTitle.children}
        </Text>
      )}
      {title && (
        <Text variant="heading-m" {...title.props}>
          {title.children}
        </Text>
      )}
      {description && (
        <Text variant="text-m" color="muted" {...description.props}>
          {description.children}
        </Text>
      )}
    </div>
  )
}

Root.displayName = 'Heading'
