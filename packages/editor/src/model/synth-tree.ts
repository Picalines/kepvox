import { isTuple } from '@repo/common/predicate'
import type { SynthNode } from '@repo/synth'
import { createFactory } from '@withease/factories'
import { combine, createEvent, createStore, sample } from 'effector'
import { produce } from 'immer'
import { readonly, reset, spread } from 'patronum'
import { NODE_SYNTH_CONSTRUCTORS } from '#meta'
import type { ActionPayload } from './action'
import type { HistoryStore } from './history'
import type { PlaybackStore } from './playback'
import type { ConnectionPoint, EdgeId, NodeColor, NodeId, NodeType } from './project'

export type Node = {
  id: NodeId
  type: NodeType
  position: { x: number; y: number }
  number: number
  color: NodeColor
  selected: boolean
  synthNode: SynthNode
}

export type Edge = {
  id: EdgeId
  source: ConnectionPoint
  target: ConnectionPoint
  selected: boolean
}

type Params = {
  history: HistoryStore
  playback: PlaybackStore
}

export type SynthTreeStore = ReturnType<typeof createSynthTree>

export const createSynthTree = createFactory((params: Params) => {
  const { history, playback } = params

  const $nodes = createStore<ReadonlyMap<NodeId, Node>>(new Map())
  const $edges = createStore<ReadonlyMap<EdgeId, Edge>>(new Map())

  const initialized = createEvent()

  reset({ clock: playback.initialized, target: [$nodes, $edges] })
  sample({ clock: playback.initialized, target: initialized })

  const $hasOutputNode = combine($nodes, nodes => nodes.values().some(node => node.type === 'output'))

  const $activeNode = combine($nodes, nodes => {
    const firstTwoSelected = nodes
      .values()
      .filter(node => node.selected)
      .take(2)
      .toArray()

    return isTuple(firstTwoSelected, 1) ? firstTwoSelected[0] : null
  })

  const createNodeDispatched = sample({
    clock: history.dispatched,
    filter: (action: ActionPayload) => action.action === 'synth-node-create',
  })

  sample({
    clock: createNodeDispatched,
    source: { nodes: $nodes, context: playback.$context, hasOutputNode: $hasOutputNode },
    target: $nodes,
    fn: ({ nodes, context, hasOutputNode }, { id, type, position, number, color }) => {
      if (!context || nodes.has(id) || (hasOutputNode && type === 'output')) {
        return nodes
      }

      const synthNode = type === 'output' ? context.output : new NODE_SYNTH_CONSTRUCTORS[type](context)

      const newNodes = new Map(nodes)
      newNodes.set(id, { id, type, position, synthNode, number, color, selected: false })
      return newNodes
    },
  })

  const moveNodeDispatched = sample({
    clock: history.dispatched,
    filter: (action: ActionPayload) => action.action === 'synth-node-move',
  })

  sample({
    clock: moveNodeDispatched,
    source: $nodes,
    target: $nodes,
    fn: (nodes, { id, to: position }) => {
      const node = nodes.get(id)
      if (!node) {
        return nodes
      }

      const newNodes = new Map(nodes)
      newNodes.set(id, { ...node, position })
      return newNodes
    },
  })

  const deleteNodeDispatched = sample({
    clock: history.dispatched,
    filter: (action: ActionPayload) => action.action === 'synth-node-delete',
  })

  sample({
    clock: deleteNodeDispatched,
    source: { nodes: $nodes, edges: $edges },
    target: spread({ nodes: $nodes, edges: $edges }),
    fn: ({ nodes, edges }, { id }) => {
      const node = nodes.get(id)
      if (!node || node.type === 'output') {
        return { nodes, edges }
      }

      const newNodes = new Map(nodes)
      const newEdges = new Map(edges)

      newNodes.delete(id)
      for (const edge of edges.values()) {
        if (edge.source.node === id || edge.target.node === id) {
          newEdges.delete(edge.id)
        }
      }

      node.synthNode.dispose()

      return { nodes: newNodes, edges: newEdges }
    },
  })

  const setColorNodeDispatched = sample({
    clock: history.dispatched,
    filter: (action: ActionPayload) => action.action === 'synth-node-color-set',
  })

  sample({
    clock: setColorNodeDispatched,
    source: $nodes,
    target: $nodes,
    fn: (nodes, { id, color }) =>
      produce(nodes, draft => {
        const node = nodes.get(id)
        if (node && node.color !== color) {
          draft.set(id, { ...node, color })
        }
      }),
  })

  const createEdgeDispatched = sample({
    clock: history.dispatched,
    filter: (action: ActionPayload) => action.action === 'synth-edge-create',
  })

  sample({
    clock: createEdgeDispatched,
    source: { nodes: $nodes, edges: $edges },
    target: $edges,
    fn: ({ nodes, edges }, { id, source, target }) => {
      const sourceNode = nodes.get(source.node)
      const targetNode = nodes.get(target.node)
      if (!sourceNode || !targetNode || edges.has(id)) {
        return edges
      }

      const edgeExists = edges
        .values()
        .some(edge => connectionPointEquals(edge.source, source) && connectionPointEquals(edge.target, target))

      if (
        edgeExists ||
        !isOutputSocketValid(sourceNode.synthNode, source.socket) ||
        !isInputSocketValid(targetNode.synthNode, target.socket)
      ) {
        return edges
      }

      const newEdges = new Map(edges)
      newEdges.set(id, { id, source, target, selected: false })

      sourceNode.synthNode.connect(targetNode.synthNode, source.socket, target.socket)

      return newEdges
    },
  })

  const deleteEdgeDispatched = sample({
    clock: history.dispatched,
    filter: (action: ActionPayload) => action.action === 'synth-edge-delete',
  })

  sample({
    clock: deleteEdgeDispatched,
    source: { nodes: $nodes, edges: $edges },
    target: $edges,
    fn: ({ nodes, edges }, { id }) => {
      const edge = edges.get(id)
      if (!edge) {
        return edges
      }

      const sourceNode = nodes.get(edge.source.node)
      const targetNode = nodes.get(edge.target.node)
      if (!sourceNode || !targetNode) {
        return edges
      }

      const newEdges = new Map(edges)
      newEdges.delete(id)

      sourceNode.synthNode.disconnect(targetNode.synthNode, edge.source.socket, edge.target.socket)

      return newEdges
    },
  })

  const selectNodeDispatched = sample({
    clock: history.dispatched,
    filter: (action: ActionPayload) => action.action === 'synth-node-select',
  })

  sample({
    clock: selectNodeDispatched,
    source: $nodes,
    filter: (nodes, { id }) => nodes.has(id),
    target: $nodes,
    fn: (nodes, { id, selected }) => {
      const node = nodes.get(id)
      if (!node) {
        return nodes
      }

      const newNodes = new Map(nodes)
      newNodes.set(id, { ...node, selected })
      return newNodes
    },
  })

  const selectEdgeDispatched = sample({
    clock: history.dispatched,
    filter: (action: ActionPayload) => action.action === 'synth-edge-select',
  })

  sample({
    clock: selectEdgeDispatched,
    source: $edges,
    filter: (edges, { id }) => edges.has(id),
    target: $edges,
    fn: (edges, { id, selected }) => {
      const edge = edges.get(id)
      if (!edge) {
        return edges
      }

      const newEdges = new Map(edges)
      newEdges.set(id, { ...edge, selected })
      return newEdges
    },
  })

  return {
    $nodes: readonly($nodes),
    $edges: readonly($edges),
    $activeNode: readonly($activeNode),
    initialized,
  }
})

const connectionPointEquals = (a: ConnectionPoint, b: ConnectionPoint) => a.node === b.node && a.socket === b.socket

const isInputSocketValid = (node: SynthNode, socket: number) => socket >= 0 && socket < node.numberOfInputs

const isOutputSocketValid = (node: SynthNode, socket: number) => socket >= 0 && socket < node.numberOfOutputs
