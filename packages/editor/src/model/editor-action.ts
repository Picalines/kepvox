import type { ConnectionPoint, EdgeId, NodeId, SynthTreeNodeType } from './synth-tree'

export type EditorAction =
  | {
      type: 'synth-tree-node-created'
      id: NodeId
      nodeType: SynthTreeNodeType
      position: { x: number; y: number }
    }
  | { type: 'synth-tree-node-moved'; id: NodeId; to: { x: number; y: number } }
  | { type: 'synth-tree-node-deleted'; id: NodeId }
  | { type: 'synth-tree-edge-created'; id: EdgeId; source: ConnectionPoint; target: ConnectionPoint }
  | { type: 'synth-tree-edge-deleted'; id: EdgeId }
  | { type: 'synth-tree-node-selected'; id: NodeId; selected: boolean }
  | { type: 'synth-tree-edge-selected'; id: EdgeId; selected: boolean }

export type EditorActionType = EditorAction['type']

export const TRACKED_EDITOR_ACTIONS: EditorActionType[] = [
  'synth-tree-node-created',
  'synth-tree-node-moved',
  'synth-tree-node-deleted',
  'synth-tree-edge-created',
  'synth-tree-edge-deleted',
]
