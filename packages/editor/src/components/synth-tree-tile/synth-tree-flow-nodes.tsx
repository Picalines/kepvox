import { cn, tw } from '@repo/ui-kit/classnames'
import { Card } from '@repo/ui-kit/components/card'
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
import { type NodeType as SynthNodeType, editorModel } from '#model'

export type SynthFlowNode = FlowNode<{ type: SynthNodeType }, 'synth'>

const NODE_TYPE_CLASSNAMES: Record<SynthNodeType, string> = {
  output: tw`from-zinc-500 to-zinc-600`,
  delay: tw`from-blue-500 to-blue-600`,
  gain: tw`from-blue-500 to-blue-600`,
  generator: tw`from-emerald-500 to-emerald-600`,
  oscillator: tw`from-emerald-500 to-emerald-600`,
  reverb: tw`from-blue-500 to-blue-600`,
}

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
    fn: nodes => nodes.get(id),
  })

  const { length: outgoingConnections } = useNodeConnections({ handleType: 'source' })

  if (!node) {
    return <Loader />
  }

  const { numberOfInputs, numberOfOutputs } = node.synthNode

  return (
    <>
      <Card.Root
        className={cn(
          'border-2 border-accent bg-gradient-to-b ring-offset-background transition-all',
          selected && 'ring-2 ring-offset-2',
          NODE_TYPE_CLASSNAMES[type],
          isPlaying && !outgoingConnections && numberOfOutputs && 'opacity-65',
        )}
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <Card.Header>
          <Text className="text-white">
            {type[0]?.toUpperCase()}
            {type.slice(1)}
          </Text>
        </Card.Header>
      </Card.Root>
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
