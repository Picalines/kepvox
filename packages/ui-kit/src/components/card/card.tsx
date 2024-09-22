import { cn } from '@/lib/classnames'
import { createSlot, useSlots } from '@/lib/slots'
import { type ComponentProps, forwardRef } from 'react'

type RootProps = ComponentProps<'div'>
type HeaderProps = ComponentProps<'div'>
type ContentProps = ComponentProps<'div'>
type FooterProps = ComponentProps<'div'>

const HeaderSlot = createSlot<HeaderProps>('Header')
const ContentSlot = createSlot<ContentProps>('Content')
const FooterSlot = createSlot<FooterProps>('Footer')

const Root = forwardRef<HTMLDivElement, RootProps>(({ className, children, ...props }, ref) => {
  const slots = useSlots({ children, defaultSlot: ContentSlot })

  const header = slots.get(HeaderSlot)
  const content = slots.get(ContentSlot)
  const footer = slots.get(FooterSlot)

  if (!header && !content && !footer) {
    return null
  }

  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col gap-3 rounded-lg border border-border bg-card p-3 text-card-foreground shadow-sm',
        className,
      )}
      {...props}
    >
      {header && (
        <div {...header.props} ref={header.ref}>
          {header.children}
        </div>
      )}

      {content && (
        <div {...content.props} ref={content.ref}>
          {content.children}
        </div>
      )}

      {footer && (
        <div {...footer.props} ref={footer.ref}>
          {footer.children}
        </div>
      )}
    </div>
  )
})

const Card = Object.assign(Root, {
  Header: HeaderSlot,
  Content: ContentSlot,
  Footer: FooterSlot,
})

Card.displayName = 'Card'

export {
  Card,
  type RootProps as CardProps,
  type HeaderProps as CardHeaderProps,
  type ContentProps as CardContentProps,
  type FooterProps as CardFooterProps,
}
