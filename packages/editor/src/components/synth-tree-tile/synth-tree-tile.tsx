import { assertDefined } from '@repo/common/assert'
import { Loader } from '@repo/ui-kit/components/loader'
import {
  Background,
  BackgroundVariant,
  type Edge as FlowEdge,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
  ReactFlow,
} from '@xyflow/react'
import { useUnit } from 'effector-react'
import { nanoid } from 'nanoid'
import { type ComponentProps, type FC, memo, useCallback, useId, useMemo, useRef } from 'react'
import { type Edge as SynthTreeEdge, type Node as SynthTreeNode, editorModel } from '#model'
import { SynthTreeControls } from './synth-tree-controls'
import { synthTreeEdgeChangeToAction, synthTreeNodeChangeToAction } from './synth-tree-flow-change'
import { SYNTH_TREE_FLOW_NODES, type SynthFlowNode } from './synth-tree-flow-nodes'

type ReactFlowProps = Required<ComponentProps<typeof ReactFlow>>

const MemoizedControls = memo(SynthTreeControls)

const FLOW_PRO_OPTIONS = { hideAttribution: true }

export const SynthTreeTile: FC = () => {
  const { dispatch, nodes, edges, isLoaded } = useUnit({
    dispatch: editorModel.actionDispatched,
    nodes: editorModel.$synthNodes,
    edges: editorModel.$synthEdges,
    isLoaded: editorModel.$isLoaded,
  })

  const isHoveringFlow = useRef(false)
  const flowNodeCache = useRef(new WeakMap<SynthTreeNode, SynthFlowNode>())
  const flowEdgeCache = useRef(new WeakMap<SynthTreeEdge, FlowEdge>())

  const flowNodes = useMemo(
    () => mapWithWeakMemo(nodes.values(), flowNodeCache.current, synthTreeNodeToFlow).toArray(),
    [nodes],
  )

  const flowEdges = useMemo(
    () => mapWithWeakMemo(edges.values(), flowEdgeCache.current, synthTreeEdgeToFlow).toArray(),
    [edges],
  )

  const onNodesChange = useCallback<OnNodesChange>(
    changes => {
      if (!isHoveringFlow.current) return
      changes
        .map(synthTreeNodeChangeToAction)
        .filter(action => action !== null)
        .forEach(dispatch)
    },
    [dispatch],
  )

  const onEdgesChange = useCallback<OnEdgesChange>(
    changes => {
      if (!isHoveringFlow.current) return
      changes
        .map(synthTreeEdgeChangeToAction)
        .filter(action => action !== null)
        .forEach(dispatch)
    },
    [dispatch],
  )

  const onConnect = useCallback<OnConnect>(
    ({ source, sourceHandle, target, targetHandle }) => {
      dispatch({
        action: 'synth-edge-create',
        id: nanoid(),
        source: { node: source, socket: Number.parseInt(sourceHandle ?? '0') },
        target: { node: target, socket: Number.parseInt(targetHandle ?? '0') },
      })
    },
    [dispatch],
  )

  const onMouseEnter = useCallback<ReactFlowProps['onMouseEnter']>(() => {
    isHoveringFlow.current = true
  }, [])

  const onMouseLeave = useCallback<ReactFlowProps['onMouseLeave']>(() => {
    isHoveringFlow.current = false
  }, [])

  const containerRef = useRef<HTMLDivElement>(null)

  const id = useId() // NOTE: needed for this ReactFlow to be unique

  if (!isLoaded) {
    return <Loader centered />
  }

  return (
    <ReactFlow
      id={id}
      nodeTypes={SYNTH_TREE_FLOW_NODES}
      nodes={flowNodes}
      edges={flowEdges}
      fitView
      fitViewOptions={{ maxZoom: 1.1 }}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      proOptions={FLOW_PRO_OPTIONS}
      ref={containerRef}
    >
      <MemoizedControls containerRef={containerRef} />
      <Background variant={BackgroundVariant.Dots} />
    </ReactFlow>
  )
}

const mapWithWeakMemo = <T extends WeakKey, U>(items: IteratorObject<T>, cache: WeakMap<T, U>, map: (item: T) => U) =>
  items.map(item => {
    if (cache.has(item)) {
      const cachedTransform = cache.get(item)
      assertDefined(cachedTransform)
      return cachedTransform
    }

    const transformed = map(item)
    cache.set(item, transformed)
    return transformed
  })

const synthTreeNodeToFlow = (node: SynthTreeNode): SynthFlowNode => {
  return {
    id: node.id,
    type: 'synth',
    position: node.position,
    selected: node.selected,
    data: { type: node.type },
    width: 125,
    height: 75,
    measured: { width: 125, height: 75 },
    origin: [0.5, 0.5],
  }
}

const synthTreeEdgeToFlow = (edge: SynthTreeEdge): FlowEdge => {
  return {
    id: edge.id,
    source: edge.source.node,
    target: edge.target.node,
    sourceHandle: String(edge.source.socket),
    targetHandle: String(edge.target.socket),
    selected: edge.selected,
    animated: true,
  }
}
