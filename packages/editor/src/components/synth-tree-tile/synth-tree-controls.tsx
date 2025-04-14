import { Button } from '@repo/ui-kit/components/button'
import { Text } from '@repo/ui-kit/components/text'
import { Tooltip } from '@repo/ui-kit/components/tooltip'
import { MaximizeIcon, PlusIcon, ZoomInIcon, ZoomOutIcon } from '@repo/ui-kit/icons'
import { Controls as ReactFlowControls, useReactFlow } from '@xyflow/react'
import { useUnit } from 'effector-react'
import { type ComponentProps, type FC, type RefObject, useCallback } from 'react'
import { editorModel } from '#model'

type Props = {
  containerRef: RefObject<HTMLElement | null>
}

export const SynthTreeControls: FC<Props> = props => {
  const { containerRef } = props

  const { isReadonly, selectNodePosition } = useUnit({
    isReadonly: editorModel.$isReadonly,
    selectNodePosition: editorModel.userSelectedNodePosition,
  })

  const { zoomIn, zoomOut, fitView, screenToFlowPosition } = useReactFlow()

  const onAddClick = useCallback(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    const bounds = container.getBoundingClientRect()
    const centerX = bounds.left + bounds.width / 2
    const centerY = bounds.top + bounds.height / 2

    selectNodePosition({ position: screenToFlowPosition({ x: centerX, y: centerY }) })
  }, [containerRef, selectNodePosition, screenToFlowPosition])

  return (
    <>
      <ControlsAnchor position="top-right">
        {!isReadonly && <ControlButton Icon={PlusIcon} tooltip="Add" onClick={onAddClick} />}
      </ControlsAnchor>
      <ControlsAnchor position="bottom-right">
        <ControlButton Icon={ZoomInIcon} tooltip="Zoom in" onClick={zoomIn} />
        <ControlButton Icon={ZoomOutIcon} tooltip="Zoom out" onClick={zoomOut} />
        <ControlButton Icon={MaximizeIcon} tooltip="Fit view" onClick={fitView} />
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
        <Button variant="outline" className="relative size-10" onClick={onClick}>
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
