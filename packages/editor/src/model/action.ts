import type { ConnectionPoint, EdgeId, NodeId, NodeType } from './synth-tree'

export type ActionPayload =
  | {
      action: 'synth-tree-node-created'
      id: NodeId
      type: NodeType
      position: { x: number; y: number }
    }
  | { action: 'synth-tree-node-selected'; id: NodeId; selected: boolean }
  | { action: 'synth-tree-node-moved'; id: NodeId; to: { x: number; y: number } }
  | { action: 'synth-tree-node-deleted'; id: NodeId }
  | {
      action: 'synth-tree-edge-created'
      id: EdgeId
      source: ConnectionPoint
      target: ConnectionPoint
    }
  | { action: 'synth-tree-edge-selected'; id: EdgeId; selected: boolean }
  | { action: 'synth-tree-edge-deleted'; id: EdgeId }

export type Action = ActionPayload['action']

export const TRACKED_EDITOR_ACTIONS: Action[] = [
  'synth-tree-node-created',
  'synth-tree-node-moved',
  'synth-tree-node-deleted',
  'synth-tree-edge-created',
  'synth-tree-edge-deleted',
]
