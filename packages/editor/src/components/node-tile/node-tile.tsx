import { Text } from '@repo/ui-kit/components/text'
import { MousePointerClickIcon } from '@repo/ui-kit/icons'
import { useStoreMap } from 'effector-react'
import type { FC } from 'react'
import { editorModel } from '#model'
import { NodeColorSelect } from './node-color-select'
import { NodeControlGrid } from './node-control-grid'
import { NodeHeading } from './node-heading'

export const NodeTile: FC = () => {
  const hasActiveNode = useStoreMap({
    store: editorModel.$activeSynthNode,
    fn: Boolean,
    keys: [],
  })

  if (!hasActiveNode) {
    return (
      <div className="relative size-full bg-background">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 flex flex-col items-center text-nowrap text-muted-foreground">
          <MousePointerClickIcon />
          <Text>select node</Text>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex shrink-0 items-center border-b p-3">
        <NodeHeading />
        <div className="grow" />
        <NodeColorSelect />
      </div>
      <NodeControlGrid />
    </div>
  )
}
