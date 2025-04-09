import type { ConnectionPoint, EdgeId, NodeId, NodeType, NoteId } from './project'

export type ActionPayload =
  | {
      action: 'synth-node-created'
      id: NodeId
      type: NodeType
      position: { x: number; y: number }
    }
  | { action: 'synth-node-selected'; id: NodeId; selected: boolean }
  | { action: 'synth-node-moved'; id: NodeId; to: { x: number; y: number } }
  | { action: 'synth-node-deleted'; id: NodeId }
  | {
      action: 'synth-edge-created'
      id: EdgeId
      source: ConnectionPoint
      target: ConnectionPoint
    }
  | { action: 'synth-edge-selected'; id: EdgeId; selected: boolean }
  | { action: 'synth-edge-deleted'; id: EdgeId }
  | { action: 'synth-node-param-set'; id: NodeId; param: string; value: string | number }

export type Action = ActionPayload['action']

export const TRACKED_EDITOR_ACTIONS: Action[] = [
  'synth-node-created',
  'synth-node-moved',
  'synth-node-deleted',
  'synth-edge-created',
  'synth-edge-deleted',
  'synth-node-param-set',
]
