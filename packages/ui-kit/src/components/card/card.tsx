import type { SetRequired } from '@repo/common/typing'
import type { ComponentPropsWithRef, FC } from 'react'
import { cn } from '#lib/classnames'
import { createSlot, useSlots } from '#lib/slots'

export type RootProps = SetRequired<ComponentPropsWithRef<'div'>, 'children'>
export type HeaderProps = ComponentPropsWithRef<'div'>
export type ContentProps = ComponentPropsWithRef<'div'>
export type FooterProps = ComponentPropsWithRef<'div'>

export const Header = createSlot({ name: 'Header' }).component<HeaderProps>()
export const Content = createSlot({ name: 'Content' }).component<ContentProps>()
export const Footer = createSlot({ name: 'Footer' }).component<FooterProps>()

export const Root: FC<RootProps> = ({ className, children, ...rootProps }) => {
  const { header, content, footer } = useSlots(children, { header: Header, content: Content, footer: Footer })

  if (!header && !content && !footer) {
    return null
  }

  return (
    <div
      {...rootProps}
      className={cn('flex flex-col gap-3 rounded-lg border bg-card p-3 text-card-foreground shadow-xs', className)}
    >
      {header?.children && (
        <div {...header.props} ref={header.ref}>
          {header.children}
        </div>
      )}

      {content?.children && (
        <div {...content.props} ref={content.ref}>
          {content.children}
        </div>
      )}

      {footer?.children && (
        <div {...footer.props} className={cn('mt-auto', footer.props.className)} ref={footer.ref}>
          {footer.children}
        </div>
      )}
    </div>
  )
}

Root.displayName = 'Card'
