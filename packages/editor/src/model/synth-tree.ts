import type { SynthNode } from '@repo/synth'
import { createFactory } from '@withease/factories'
import { createEvent, createStore, sample } from 'effector'
import { nanoid } from 'nanoid'
import { readonly, spread } from 'patronum'
import type { PlaybackStore } from './playback'
import { CREATABLE_SYNTH_NODES } from './synth-node-meta'

declare const SYNTH_TREE_ID: unique symbol

export type NodeId = string & { [SYNTH_TREE_ID]?: 'node' }

export type SynthTreeNodeType = 'output' | keyof typeof CREATABLE_SYNTH_NODES

export type NodePosition = { x: number; y: number }

export type Node = {
  id: NodeId
  type: SynthTreeNodeType
  position: { x: number; y: number }
  synthNode: SynthNode
}

export type EdgeId = string & { [SYNTH_TREE_ID]?: 'edge' }

export type ConnectionPoint = { node: NodeId; socket: number }

export type Edge = {
  id: EdgeId
  source: ConnectionPoint
  target: ConnectionPoint
}

type Params = {
  playback: PlaybackStore
}

const OUTPUT_NODE_ID: NodeId = 'output'

export type SynthTreeStore = ReturnType<typeof createSynthTree>

export const createSynthTree = createFactory((params: Params) => {
  const { playback } = params

  const $nodes = createStore<ReadonlyMap<NodeId, Node>>(new Map())
  const $edges = createStore<ReadonlyMap<EdgeId, Edge>>(new Map())

  const nodeCreated = createEvent<{ type: SynthTreeNodeType; position: NodePosition }>()
  const nodeMoved = createEvent<{ id: NodeId; position: NodePosition }>()
  const nodeDeleted = createEvent<{ id: NodeId }>()
  const edgeCreated = createEvent<{ source: ConnectionPoint; target: ConnectionPoint }>()
  const edgeDeleted = createEvent<{ id: EdgeId }>()

  sample({
    clock: playback.$context,
    filter: Boolean,
    target: $nodes,
    fn: context => {
      const outputNode: Node = {
        id: OUTPUT_NODE_ID,
        type: 'output',
        position: { x: 0, y: 0 },
        synthNode: context.output,
      }
      return new Map([[OUTPUT_NODE_ID, outputNode]])
    },
  })

  sample({
    clock: nodeCreated,
    source: { nodes: $nodes, context: playback.$context },
    target: $nodes,
    fn: ({ nodes, context }, { type, position }) => {
      if (!context || type === 'output') {
        return nodes
      }

      const id = nanoid() as NodeId
      const synthNode = new CREATABLE_SYNTH_NODES[type](context)

      const newNodes = new Map(nodes)
      newNodes.set(id, { id, type, position, synthNode })
      return newNodes
    },
  })

  sample({
    clock: nodeMoved,
    source: $nodes,
    target: $nodes,
    fn: (nodes, { id, position }) => {
      const node = nodes.get(id)
      if (!node) {
        return nodes
      }

      const newNodes = new Map(nodes)
      newNodes.set(id, { ...node, position })
      return newNodes
    },
  })

  sample({
    clock: nodeDeleted,
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

  sample({
    clock: edgeCreated,
    source: { nodes: $nodes, edges: $edges },
    target: $edges,
    fn: ({ nodes, edges }, { source, target }) => {
      const sourceNode = nodes.get(source.node)
      const targetNode = nodes.get(target.node)
      if (!sourceNode || !targetNode) {
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

      const id = nanoid() as EdgeId
      newEdges.set(id, { id, source, target })

      sourceNode.synthNode.connect(targetNode.synthNode, source.socket, target.socket)

      return newEdges
    },
  })

  sample({
    clock: edgeDeleted,
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

  return {
    $nodes: readonly($nodes),
    $edges: readonly($edges),
    nodeCreated,
    nodeMoved,
    nodeDeleted,
    edgeCreated,
    edgeDeleted,
  }
})

const connectionPointEquals = (a: ConnectionPoint, b: ConnectionPoint) => a.node === b.node && a.socket === b.socket

const isInputSocketValid = (node: SynthNode, socket: number) => socket >= 0 && socket < node.numberOfInputs

const isOutputSocketValid = (node: SynthNode, socket: number) => socket >= 0 && socket < node.numberOfOutputs
