import { type ComponentProps, forwardRef } from 'react'
import { cn } from '#lib/classnames'
import { createSlot, useSlots } from '#lib/slots'

export type RootProps = ComponentProps<'div'>
export type HeaderProps = ComponentProps<'div'>
export type ContentProps = ComponentProps<'div'>
export type FooterProps = ComponentProps<'div'>

export const Header = createSlot<HeaderProps>('Header')
export const Content = createSlot<ContentProps>('Content')
export const Footer = createSlot<FooterProps>('Footer')

export const Root = forwardRef<HTMLDivElement, RootProps>(({ className, children, ...props }, ref) => {
  const slots = useSlots({ children, defaultSlot: Content })

  const header = slots.get(Header)
  const content = slots.get(Content)
  const footer = slots.get(Footer)

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
