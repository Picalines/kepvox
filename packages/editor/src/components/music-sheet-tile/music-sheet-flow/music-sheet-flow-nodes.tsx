import { cn, tw } from '@repo/ui-kit/classnames'
import { Text } from '@repo/ui-kit/components/text'
import { XIcon } from '@repo/ui-kit/icons'
import type { Node as FlowNode, NodeProps, NodeTypes } from '@xyflow/react'
import { useStoreMap } from 'effector-react'
import type { FC } from 'react'
import { type NodeColor, editorModel } from '#model'

export type SheetNoteFlowNode = FlowNode<{}, 'note'>

const NoteFlowNodeComponent: FC<NodeProps<SheetNoteFlowNode>> = props => {
  const { id, selected, width, height } = props

  const note = useStoreMap({
    store: editorModel.$sheetNotes,
    keys: [id],
    fn: notes => notes.get(id) ?? null,
  })

  const synthId = note?.synthId ?? ''

  const synthNumber = useStoreMap({
    store: editorModel.$synthNodes,
    keys: [synthId],
    fn: nodes => nodes.get(synthId)?.number ?? null,
  })

  const synthColor = useStoreMap({
    store: editorModel.$synthNodes,
    keys: [synthId],
    fn: nodes => nodes.get(synthId)?.color ?? 'zinc',
  })

  return (
    <div
      className={cn(
        'relative flex items-center rounded-md bg-gradient-to-r px-1 ring-offset-background transition-all',
        SYNTH_COLOR_CLASSNAMES[synthColor],
        selected && 'ring-2 ring-offset-2',
      )}
      style={{ width, height }}
    >
      <Text color="inherit" weight="bold">
        {synthNumber ?? <XIcon className="zoom-in-75 fade-in-0 animate-in" />}
      </Text>
    </div>
  )
}

export const MUSIC_SHEET_FLOW_NODES = { note: NoteFlowNodeComponent } satisfies NodeTypes

const SYNTH_COLOR_CLASSNAMES: Record<NodeColor, string> = {
  red: tw`from-red-500 to-red-600 text-red-100`,
  orange: tw`from-orange-500 to-orange-600 text-orange-100`,
  amber: tw`from-amber-500 to-amber-600 text-amber-100`,
  yellow: tw`from-yellow-500 to-yellow-600 text-yellow-100`,
  lime: tw`from-lime-500 to-lime-600 text-lime-100`,
  green: tw`from-green-500 to-green-600 text-green-100`,
  emerald: tw`from-emerald-500 to-emerald-600 text-emerald-100`,
  teal: tw`from-teal-500 to-teal-600 text-teal-100`,
  cyan: tw`from-cyan-500 to-cyan-600 text-cyan-100`,
  sky: tw`from-sky-500 to-sky-600 text-sky-100`,
  blue: tw`from-blue-500 to-blue-600 text-blue-100`,
  indigo: tw`from-indigo-500 to-indigo-600 text-indigo-100`,
  violet: tw`from-violet-500 to-violet-600 text-violet-100`,
  purple: tw`from-purple-500 to-purple-600 text-purple-100`,
  fuchsia: tw`from-fuchsia-500 to-fuchsia-600 text-fuchsia-100`,
  pink: tw`from-pink-500 to-pink-600 text-pink-100`,
  rose: tw`from-rose-500 to-rose-600 text-rose-100`,
  zinc: tw`from-zinc-500 to-zinc-600 text-zinc-100`,
}
