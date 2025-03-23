import type { FC, ReactNode } from 'react'
import * as ResizablePrimitive from 'react-resizable-panels'
import { cn } from '#lib/classnames'

export type GroupProps = {
  className?: string
  children: ReactNode
  direction: 'horizontal' | 'vertical'
}

export type PanelProps = {
  className?: string
  children: ReactNode
  defaultSize?: number
  maxSize?: number
  minSize?: number
  order?: number
  onResize?: (size: number) => void
}

export type HandleProps = {
  className?: string
  children?: ReactNode
  disabled?: boolean
  onFocus?: () => void
  onBlur?: () => void
}

export const Group: FC<GroupProps> = ({ className, ...props }) => (
  <ResizablePrimitive.PanelGroup
    {...props}
    className={cn('flex h-full w-full data-[panel-group-direction=vertical]:flex-col', className)}
  />
)

export const Panel: FC<PanelProps> = props => <ResizablePrimitive.Panel {...props} />

export const Handle: FC<HandleProps> = ({ className, children, ...props }) => (
  <ResizablePrimitive.PanelResizeHandle
    {...props}
    className={cn(
      'after:-translate-x-1/2 data-[panel-group-direction=vertical]:after:-translate-y-1/2 group relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:bg-blue-500 after:transition-all focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=horizontal]:data-[resize-handle-state=inactive]:after:w-0 data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[resize-handle-state=inactive]:after:h-0 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:translate-x-0 data-[resize-handle-state=inactive]:after:bg-transparent [&[data-panel-group-direction=vertical]>div]:rotate-90',
      className,
    )}
  >
    {children && (
      <div className="z-1 rounded-sm bg-blue-500 p-1/2 transition-all group-data-[resize-handle-state=inactive]:bg-border">
        {children}
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
)
