import { cn } from '@repo/ui-kit/classnames'
import { Loader } from '@repo/ui-kit/components/loader'
import type { Node as FlowNode, NodeProps, NodeTypes } from '@xyflow/react'
import { useStoreMap } from 'effector-react'
import type { FC } from 'react'
import { editorModel } from '#model'

export type SheetNoteFlowNode = FlowNode<{}, 'note'>

const NoteFlowNodeComponent: FC<NodeProps<SheetNoteFlowNode>> = props => {
  const { id, selected, width, height } = props

  const note = useStoreMap({
    store: editorModel.$sheetNotes,
    keys: [id],
    fn: notes => notes.get(id),
  })

  if (!note) {
    return <Loader />
  }

  return (
    <>
      <div
        className={cn('relative rounded-md bg-red-500 ring-offset-background', selected && 'ring-2 ring-offset-2')}
        style={{ width, height }}
      />
    </>
  )
}

export const MUSIC_SHEET_FLOW_NODES = { note: NoteFlowNodeComponent } satisfies NodeTypes
