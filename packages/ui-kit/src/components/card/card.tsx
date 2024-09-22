import { cn } from '@/lib/classnames'
import { createSlot, useSlots } from '@/lib/slots'
import { type ComponentProps, forwardRef } from 'react'

type RootProps = ComponentProps<'div'>
type HeaderProps = ComponentProps<'div'>
type TitleProps = ComponentProps<'h3'>
type DescriptionProps = ComponentProps<'p'>
type ContentProps = ComponentProps<'div'>
type FooterProps = ComponentProps<'div'>

const HeaderSlot = createSlot<HeaderProps>('Header')
const TitleSlot = createSlot<TitleProps>('Header.Title')
const DescriptionSlot = createSlot<DescriptionProps>('Header.Description')
const ContentSlot = createSlot<ContentProps>('Content')
const FooterSlot = createSlot<FooterProps>('Footer')

const Header = forwardRef<HTMLDivElement, HeaderProps>(({ className, children, ...props }, ref) => {
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

const Root = forwardRef<HTMLDivElement, RootProps>(({ className, children, ...props }, ref) => {
  const slots = useSlots({ children, defaultSlot: ContentSlot })

  const header = slots.get(HeaderSlot)
  const content = slots.get(ContentSlot)
  const footer = slots.get(FooterSlot)

  return (
    <div
      ref={ref}
      className={cn('rounded-lg border border-border bg-card text-card-foreground shadow-sm', className)}
      {...props}
    >
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

const Card = Object.assign(Root, {
  Header: Object.assign(HeaderSlot, {
    Title: TitleSlot,
    Description: DescriptionSlot,
  }),
  Content: ContentSlot,
  Footer: FooterSlot,
})

Card.displayName = 'Card'

export {
  Card,
  type RootProps as CardProps,
  type HeaderProps as CardHeaderProps,
  type TitleProps as CardTitleProps,
  type DescriptionProps as CardDescriptionProps,
  type ContentProps as CardContentProps,
  type FooterProps as CardFooterProps,
}
