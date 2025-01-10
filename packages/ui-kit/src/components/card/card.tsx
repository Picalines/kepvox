import type { SetRequired } from '@repo/common/typing'
import { type ComponentPropsWithRef, forwardRef } from 'react'
import { cn } from '#lib/classnames'
import { createSlot, useSlots } from '#lib/slots'

export type RootProps = SetRequired<ComponentPropsWithRef<'div'>, 'children'>
export type HeaderProps = ComponentPropsWithRef<'div'>
export type ContentProps = ComponentPropsWithRef<'div'>
export type FooterProps = ComponentPropsWithRef<'div'>

export const Header = createSlot({ name: 'Header' }).component<HeaderProps>()
export const Content = createSlot({ name: 'Content' }).component<ContentProps>()
export const Footer = createSlot({ name: 'Footer' }).component<FooterProps>()

export const Root = forwardRef<HTMLDivElement, RootProps>(({ className, children, ...props }, ref) => {
  const { header, content, footer } = useSlots(children, { header: Header, content: Content, footer: Footer })

  if (!header && !content && !footer) {
    return null
  }

  return (
    <div
      ref={ref}
      className={cn('flex flex-col gap-3 rounded-lg border bg-card p-3 text-card-foreground shadow-sm', className)}
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
