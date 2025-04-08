import type { ConnectionPoint, NodeType } from './synth-tree'

declare const EDITOR_ID: unique symbol

export type NodeId = string & { [EDITOR_ID]?: 'node' }

export type EdgeId = string & { [EDITOR_ID]?: 'edge' }

export type Project = {
  synthTree: {
    nodes: Record<
      NodeId,
      {
        type: NodeType
        position: { x: number; y: number }
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
