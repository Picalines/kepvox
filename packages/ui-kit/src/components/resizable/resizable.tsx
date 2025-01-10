import type { Overlay } from '@repo/common/typing'
import type { FC, HTMLAttributes, ReactNode } from 'react'
import * as ResizablePrimitive from 'react-resizable-panels'
import { cn } from '#lib/classnames'

type HTMLElementTagName = keyof HTMLElementTagNameMap

type AnyHTMLElementAttributes = HTMLAttributes<HTMLElementTagNameMap[HTMLElementTagName]>

export type GroupProps = Overlay<
  AnyHTMLElementAttributes,
  {
    children: ReactNode
    direction: 'horizontal' | 'vertical'
    as?: HTMLElementTagName
  }
>

export type PanelProps = Overlay<
  AnyHTMLElementAttributes,
  {
    children: ReactNode
    as?: HTMLElementTagName
    defaultSize?: number
    maxSize?: number
    minSize?: number
    order?: number
    onResize?: (size: number) => void
  }
>

export type HandleProps = Overlay<
  AnyHTMLElementAttributes,
  {
    children: ReactNode
    as?: HTMLElementTagName
    disabled?: boolean
    onFocus?: () => void
    onBlur?: () => void
  }
>

export const Group: FC<GroupProps> = ({ className, as, ...props }) => (
  // @ts-expect-error react-resizable-panels specifies its props as HTMLAttributes<'div' | etc>, where HTMLAttributes actually expects HTMLDivElement | etc
  <ResizablePrimitive.PanelGroup
    {...props}
    tagName={as}
    className={cn('flex h-full w-full data-[panel-group-direction=vertical]:flex-col', className)}
  />
)

export const Panel: FC<PanelProps> = ({ as, ...props }) => <ResizablePrimitive.Panel {...props} tagName={as} />

export const Handle: FC<HandleProps> = ({ className, as, children, ...props }) => (
  // @ts-expect-error react-resizable-panels specifies its props as HTMLAttributes<'div' | etc>, where HTMLAttributes actually expects HTMLDivElement | etc
  <ResizablePrimitive.PanelResizeHandle
    {...props}
    tagName={as}
    className={cn(
      'after:-translate-x-1/2 data-[panel-group-direction=vertical]:after:-translate-y-1/2 relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90',
      className,
    )}
  >
    {children && <div className="rounded-sm bg-border p-1">{children}</div>}
  </ResizablePrimitive.PanelResizeHandle>
)
