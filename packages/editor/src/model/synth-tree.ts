import type { SynthNode } from '@repo/synth'
import { createFactory } from '@withease/factories'
import { combine, createEvent, createStore, sample } from 'effector'
import { readonly, reset, spread } from 'patronum'
import type { ActionPayload } from './action'
import type { HistoryStore } from './history'
import type { PlaybackStore } from './playback'
import { CREATABLE_SYNTH_NODES } from './synth-node-meta'

declare const SYNTH_TREE_ID: unique symbol

export type NodeId = string & { [SYNTH_TREE_ID]?: 'node' }

export type NodeType = 'output' | keyof typeof CREATABLE_SYNTH_NODES

export type NodePosition = { x: number; y: number }

export type Node = {
  id: NodeId
  type: NodeType
  position: { x: number; y: number }
  selected: boolean
  synthNode: SynthNode
}

export type EdgeId = string & { [SYNTH_TREE_ID]?: 'edge' }

export type ConnectionPoint = { node: NodeId; socket: number }

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

  const createNodeDispatched = sample({
    clock: history.dispatched,
    filter: (action: ActionPayload) => action.action === 'synth-node-created',
  })

  sample({
    clock: createNodeDispatched,
    source: { nodes: $nodes, context: playback.$context, hasOutputNode: $hasOutputNode },
    target: $nodes,
    fn: ({ nodes, context, hasOutputNode }, { id, type, position }) => {
      if (!context || nodes.has(id) || (hasOutputNode && type === 'output')) {
        return nodes
      }

      const synthNode = type === 'output' ? context.output : new CREATABLE_SYNTH_NODES[type](context)

      const newNodes = new Map(nodes)
      newNodes.set(id, { id, type, position, synthNode, selected: false })
      return newNodes
    },
  })

  const moveNodeDispatched = sample({
    clock: history.dispatched,
    filter: (action: ActionPayload) => action.action === 'synth-node-moved',
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
    filter: (action: ActionPayload) => action.action === 'synth-node-deleted',
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

  const createEdgeDispatched = sample({
    clock: history.dispatched,
    filter: (action: ActionPayload) => action.action === 'synth-edge-created',
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
    filter: (action: ActionPayload) => action.action === 'synth-edge-deleted',
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
    filter: (action: ActionPayload) => action.action === 'synth-node-selected',
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
    filter: (action: ActionPayload) => action.action === 'synth-edge-selected',
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
    initialized,
  }
})

const connectionPointEquals = (a: ConnectionPoint, b: ConnectionPoint) => a.node === b.node && a.socket === b.socket

const isInputSocketValid = (node: SynthNode, socket: number) => socket >= 0 && socket < node.numberOfInputs

const isOutputSocketValid = (node: SynthNode, socket: number) => socket >= 0 && socket < node.numberOfOutputs
