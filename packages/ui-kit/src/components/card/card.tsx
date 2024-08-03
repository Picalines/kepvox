import { cn } from '@/lib/classnames'
import { createSlot, useSlots } from '@/lib/slots'
import { type ComponentProps, forwardRef } from 'react'

const HeaderSlot = createSlot<ComponentProps<'div'>>('Header')
const TitleSlot = createSlot<ComponentProps<'h3'>>('Header.Title')
const DescriptionSlot = createSlot<ComponentProps<'p'>>('Header.Description')
const ContentSlot = createSlot<ComponentProps<'div'>>('Content')
const FooterSlot = createSlot<ComponentProps<'div'>>('Footer')

const Header = forwardRef<HTMLDivElement, ComponentProps<'div'>>(({ className, children, ...props }, ref) => {
  const slots = useSlots({ children, defaultSlot: TitleSlot })

  const title = slots.get(TitleSlot)
  const description = slots.get(DescriptionSlot)

  if (!title && !description) {
    return <div className={cn('mt-6', className)} />
  }

  return (
    <div {...props} ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)}>
      {title && (
        <h3
          {...title.props}
          ref={title.ref}
          className={cn('font-semibold text-2xl leading-none tracking-tight', title.props.className)}
        >
          {title.children}
        </h3>
      )}

      {description && (
        <p
          {...description.props}
          ref={description.ref}
          className={cn('text-muted-foreground text-sm', description.props.className)}
        >
          {description.children}
        </p>
      )}
    </div>
  )
})

const _Card = forwardRef<HTMLDivElement, ComponentProps<'div'>>(({ className, children, ...props }, ref) => {
  const slots = useSlots({ children, defaultSlot: ContentSlot })

  const header = slots.get(HeaderSlot)
  const content = slots.get(ContentSlot)
  const footer = slots.get(FooterSlot)

  return (
    <div ref={ref} className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)} {...props}>
      {header && (
        <Header {...header.props} ref={header.ref}>
          {header.children}
        </Header>
      )}

      {content && (
        <div {...content.props} ref={content.ref} className={cn('p-6 pt-0', content.props.className)}>
          {content.children}
        </div>
      )}

      {footer && (
        <div {...footer.props} ref={footer.ref} className={cn('flex items-center p-6 pt-0', footer.props.className)}>
          {footer.children}
        </div>
      )}
    </div>
  )
})

_Card.displayName = 'Card'

export type CardProps = ComponentProps<typeof Card>

export const Card = Object.assign(_Card, {
  Header: Object.assign(HeaderSlot, {
    Title: TitleSlot,
    Description: DescriptionSlot,
  }),
  Content: ContentSlot,
  Footer: FooterSlot,
})
