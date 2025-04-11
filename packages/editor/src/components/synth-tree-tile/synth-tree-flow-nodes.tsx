import { cn, tw } from '@repo/ui-kit/classnames'
import { Loader } from '@repo/ui-kit/components/loader'
import { Text } from '@repo/ui-kit/components/text'
import {
  type Node as FlowNode,
  Handle,
  type NodeProps,
  type NodeTypes,
  Position,
  useNodeConnections,
} from '@xyflow/react'
import { useStoreMap, useUnit } from 'effector-react'
import type { FC } from 'react'
import { type NodeColor, type NodeType as SynthNodeType, editorModel } from '#model'

export type SynthFlowNode = FlowNode<{ type: SynthNodeType }, 'synth'>

const SynthFlowNodeComponent: FC<NodeProps<SynthFlowNode>> = props => {
  const {
    id,
    selected,
    width,
    height,
    data: { type },
  } = props

  const { isPlaying } = useUnit({ isPlaying: editorModel.$isPlaying })

  const node = useStoreMap({
    store: editorModel.$synthNodes,
    keys: [id],
    fn: nodes => nodes.get(id) ?? null,
  })

  const { length: outgoingConnections } = useNodeConnections({ handleType: 'source' })

  if (!node) {
    return <Loader />
  }

  const {
    number,
    color,
    synthNode: { numberOfInputs, numberOfOutputs },
  } = node

  return (
    <>
      <Text
        className={cn(
          '-top-[1rlh] pointer-events-none absolute left-1 font-bold text-muted-foreground transition-all ease-out',
          selected && '-translate-y-1',
        )}
      >
        {number}
      </Text>
      <div
        className={cn(
          'rounded-md border-2 border-accent bg-gradient-to-b p-1 px-2 ring-offset-background transition-all ease-out',
          selected && 'ring-2 ring-offset-2',
          NODE_COLOR_CLASSNAMES[color],
          isPlaying && !outgoingConnections && numberOfOutputs && 'opacity-65',
        )}
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <Text className="text-white">
          {type[0]?.toUpperCase()}
          {type.slice(1)}
        </Text>
      </div>
      {Array.from({ length: numberOfInputs }).map((_, i) => (
        <Handle key={String(i)} type="target" id={String(i)} position={Position.Left} className="!h-3 !w-3" />
      ))}
      {Array.from({ length: numberOfOutputs }).map((_, i) => (
        <Handle key={String(i)} type="source" id={String(i)} position={Position.Right} className="!h-3 !w-3" />
      ))}
    </>
  )
}

export const SYNTH_TREE_FLOW_NODES = { synth: SynthFlowNodeComponent } satisfies NodeTypes

const NODE_COLOR_CLASSNAMES: Record<NodeColor, string> = {
  red: tw`from-red-500 to-red-600`,
  orange: tw`from-orange-500 to-orange-600`,
  amber: tw`from-amber-500 to-amber-600`,
  yellow: tw`from-yellow-500 to-yellow-600`,
  lime: tw`from-lime-500 to-lime-600`,
  green: tw`from-green-500 to-green-600`,
  emerald: tw`from-emerald-500 to-emerald-600`,
  teal: tw`from-teal-500 to-teal-600`,
  cyan: tw`from-cyan-500 to-cyan-600`,
  sky: tw`from-sky-500 to-sky-600`,
  blue: tw`from-blue-500 to-blue-600`,
  indigo: tw`from-indigo-500 to-indigo-600`,
  violet: tw`from-violet-500 to-violet-600`,
  purple: tw`from-purple-500 to-purple-600`,
  fuchsia: tw`from-fuchsia-500 to-fuchsia-600`,
  pink: tw`from-pink-500 to-pink-600`,
  rose: tw`from-rose-500 to-rose-600`,
  zinc: tw`from-zinc-500 to-zinc-600`,
}
