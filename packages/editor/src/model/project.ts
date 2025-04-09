import type { CREATABLE_SYNTH_NODES } from './synth-node-meta'

declare const EDITOR_ID: unique symbol

export type NodeId = string & { [EDITOR_ID]?: 'node' }

export type NodeType = 'output' | keyof typeof CREATABLE_SYNTH_NODES

export type NodePosition = { x: number; y: number }

export type EdgeId = string & { [EDITOR_ID]?: 'edge' }

export type ConnectionPoint = { node: NodeId; socket: number }

export type Project = {
  synthTree: {
    nodes: Record<
      NodeId,
      {
        type: NodeType
        position: NodePosition
        params: Record<string, number | string>
      }
    >
    edges: Record<
      EdgeId,
      {
        source: ConnectionPoint
        target: ConnectionPoint
      }
    >
  }
}
