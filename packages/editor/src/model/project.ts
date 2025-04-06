import type { ConnectionPoint, EdgeId, NodeId, NodeType } from './synth-tree'

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
    edges: Record<EdgeId, { source: ConnectionPoint; target: ConnectionPoint }>
  }
}
