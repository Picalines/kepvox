import { ScrollArea } from '@repo/ui-kit/components/scroll-area'
import { useList, useStoreMap } from 'effector-react'
import type { FC } from 'react'
import { editorModel } from '#model'
import { NodeControlInput } from './node-control-input'

export const NodeControlGrid: FC = () => {
  const nodeId = useStoreMap({
    store: editorModel.$activeSynthNode,
    fn: node => node?.id ?? null,
    keys: [],
  })

  const controls = useList(editorModel.$activeNodeControls, {
    fn: control => nodeId && <NodeControlInput nodeId={nodeId} control={control} />,
    keys: [nodeId],
    placeholder: null,
  })

  return (
    <ScrollArea.Root className="bg-background">
      <ScrollArea.Bar orientation="vertical" />
      <ScrollArea.Content>
        <div className="@container p-3">
          <div className="grid @md:grid-cols-2 grid-cols-1 gap-3">{controls}</div>
        </div>
      </ScrollArea.Content>
    </ScrollArea.Root>
  )
}
