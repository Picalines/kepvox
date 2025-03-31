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
import { type FC, memo, useCallback, useMemo, useRef } from 'react'
import { type Edge as SynthTreeEdge, type Node as SynthTreeNode, editorModel } from '#model'
import { Controls } from './controls'
import { flowEdgeChangeToEditorAction, flowNodeChangeToEditorAction } from './flow-change-to-editor-action'

import '@xyflow/react/dist/style.css'
import { nanoid } from 'nanoid'
import { FLOW_NODE_TYPES, type SynthFlowNode } from './flow-node-types'

const MemoizedControls = memo(Controls)

const proOptions = { hideAttribution: true }

export const NodesTile: FC = () => {
  const { dispatch, state, nodes, edges, isLoaded } = useUnit({
    dispatch: editorModel.actionDispatched,
    state: editorModel.$playbackState,
    nodes: editorModel.$synthNodes,
    edges: editorModel.$synthEdges,
    isLoaded: editorModel.$isLoaded,
  })

  const flowNodes = useMemo(() => nodes.values().map(synthTreeNodeToFlow).toArray(), [nodes])
  const flowEdges = useMemo(() => edges.values().map(synthTreeEdgeToFlow).toArray(), [edges])

  const onNodesChange = useCallback<OnNodesChange>(
    changes =>
      changes
        .map(flowNodeChangeToEditorAction)
        .filter(action => action !== null)
        .forEach(dispatch),
    [dispatch],
  )

  const onEdgesChange = useCallback<OnEdgesChange>(
    changes =>
      changes
        .map(flowEdgeChangeToEditorAction)
        .filter(action => action !== null)
        .forEach(dispatch),
    [dispatch],
  )

  const onConnect = useCallback<OnConnect>(
    ({ source, sourceHandle, target, targetHandle }) => {
      dispatch({
        action: 'synth-tree-edge-created',
        id: nanoid(),
        source: { node: source, socket: Number.parseInt(sourceHandle ?? '0') },
        target: { node: target, socket: Number.parseInt(targetHandle ?? '0') },
      })
    },
    [dispatch],
  )

  const containerRef = useRef<HTMLDivElement>(null)

  if (!isLoaded) {
    return <Loader centered />
  }

  if (state === 'disposed') {
    // TODO: should be an error state probably
    return <Loader centered />
  }

  return (
    <ReactFlow
      nodeTypes={FLOW_NODE_TYPES}
      nodes={flowNodes}
      edges={flowEdges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      proOptions={proOptions}
      ref={containerRef}
    >
      <MemoizedControls containerRef={containerRef} />
      <Background variant={BackgroundVariant.Dots} />
    </ReactFlow>
  )
}

const synthTreeNodeToFlow = (node: SynthTreeNode): SynthFlowNode => {
  return {
    id: node.id,
    type: 'synth',
    position: node.position,
    selected: node.selected,
    data: { type: node.type },
    width: 100,
    height: 75,
    measured: { width: 100, height: 75 },
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
  }
}
