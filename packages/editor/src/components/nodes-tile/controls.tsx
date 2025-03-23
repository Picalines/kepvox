import { Button } from '@repo/ui-kit/components/button'
import { Text } from '@repo/ui-kit/components/text'
import { Tooltip } from '@repo/ui-kit/components/tooltip'
import { MaximizeIcon, PlusIcon, ZoomInIcon, ZoomOutIcon } from '@repo/ui-kit/icons'
import { Controls as ReactFlowControls, useReactFlow } from '@xyflow/react'
import type { ComponentProps, FC } from 'react'

export const Controls: FC = () => {
  const { zoomIn, zoomOut, fitView } = useReactFlow()

  return (
    <>
      <ControlsAnchor position="top-right">
        <ControlButton Icon={PlusIcon} tooltip="Add" />
      </ControlsAnchor>
      <ControlsAnchor position="bottom-right">
        <ControlButton Icon={ZoomInIcon} onClick={() => zoomIn()} tooltip="Zoom in" />
        <ControlButton Icon={ZoomOutIcon} onClick={() => zoomOut()} tooltip="Zoom out" />
        <ControlButton Icon={MaximizeIcon} onClick={() => fitView()} tooltip="Fit view" />
      </ControlsAnchor>
    </>
  )
}

const ControlsAnchor: FC<ComponentProps<typeof ReactFlowControls>> = ({ children, ...props }) => {
  return (
    <ReactFlowControls
      showZoom={false}
      showFitView={false}
      showInteractive={false}
      position="bottom-right"
      className="gap-1"
      style={{ boxShadow: 'none' }}
      {...props}
    >
      {children}
    </ReactFlowControls>
  )
}

type ControlButtonProps = {
  Icon: FC<{ className?: string }>
  tooltip: string
  onClick?: () => void
}

const ControlButton: FC<ControlButtonProps> = ({ Icon, tooltip, onClick }) => {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger>
        <Button variant="outline" className="relative size-8" onClick={onClick}>
          <Icon className="absolute" />
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content side="left">
        <Text>{tooltip}</Text>
      </Tooltip.Content>
      <Tooltip.Arrow />
    </Tooltip.Root>
  )
}
