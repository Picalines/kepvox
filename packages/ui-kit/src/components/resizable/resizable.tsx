import { cn } from '@/lib/classnames'
import type { FC, HTMLAttributes, ReactNode } from 'react'
import * as ResizablePrimitive from 'react-resizable-panels'

type HTMLElementTagName = keyof HTMLElementTagNameMap

type GroupProps = HTMLAttributes<HTMLElementTagName> & {
  direction: 'horizontal' | 'vertical'
  children: ReactNode
  as?: HTMLElementTagName
}

type PanelProps = HTMLAttributes<HTMLElementTagName> & {
  children: ReactNode
  as?: HTMLElementTagName
  defaultSize?: number
  maxSize?: number
  minSize?: number
  order?: number
  onResize?: (size: number) => void
}

type HandleProps = HTMLAttributes<HTMLElementTagName> & {
  children?: ReactNode
  as?: HTMLElementTagName
  disabled?: boolean
  onFocus?: () => void
  onBlur?: () => void
}

const Group: FC<GroupProps> = ({ className, as, ...props }) => (
  <ResizablePrimitive.PanelGroup
    {...props}
    tagName={as}
    className={cn('flex h-full w-full data-[panel-group-direction=vertical]:flex-col', className)}
  />
)

const Panel: FC<PanelProps> = ({ as, ...props }) => <ResizablePrimitive.Panel {...props} tagName={as} />

const Handle: FC<HandleProps> = ({ className, as, children, ...props }) => (
  <ResizablePrimitive.PanelResizeHandle
    {...props}
    tagName={as}
    className={cn(
      'after:-translate-x-1/2 data-[panel-group-direction=vertical]:after:-translate-y-1/2 relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90',
      className,
    )}
  >
    {children && <div className="rounded-sm bg-border p-1">{children}</div>}
  </ResizablePrimitive.PanelResizeHandle>
)

const Resizable = Object.assign(Group, {
  Panel,
  Handle,
})

export {
  Resizable,
  type GroupProps as ResizableProps,
  type PanelProps as ResizablePanelProps,
  type HandleProps as ResizableHandleProps,
}
