import type { FC, ReactNode } from 'react'
import * as ResizablePrimitive from 'react-resizable-panels'

export type GroupProps = {
  children: ReactNode
  direction: 'horizontal' | 'vertical'
}

export type PanelProps = {
  children: ReactNode
  defaultSize?: number
  maxSize?: number
  minSize?: number
  order?: number
  onResize?: (size: number) => void
}

export type HandleProps = {
  children?: ReactNode
  disabled?: boolean
  onFocus?: () => void
  onBlur?: () => void
}

export const Group: FC<GroupProps> = ({ ...props }) => (
  <ResizablePrimitive.PanelGroup
    {...props}
    className="flex h-full w-full data-[panel-group-direction=vertical]:flex-col"
  />
)

export const Panel: FC<PanelProps> = props => <ResizablePrimitive.Panel {...props} className="relative" />

export const Handle: FC<HandleProps> = ({ children, ...props }) => (
  <ResizablePrimitive.PanelResizeHandle
    {...props}
    className="after:-translate-x-1/2 data-[panel-group-direction=vertical]:after:-translate-y-1/2 group relative flex items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:bg-primary after:transition-all focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=horizontal]:w-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:data-[resize-handle-state=inactive]:after:h-0 data-[panel-group-direction=horizontal]:data-[resize-handle-state=inactive]:after:w-0 data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=horizontal]:after:w-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:translate-x-0 data-[resize-handle-state=inactive]:after:bg-transparent [&[data-panel-group-direction=vertical]>div]:rotate-90"
  >
    {children && (
      <div className="z-1 rounded-sm bg-border p-1/2 ring-4 ring-primary transition-all group-data-[resize-handle-state=inactive]:ring-0">
        {children}
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
)
