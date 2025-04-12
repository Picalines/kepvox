import type { PitchNotation, SynthTime } from '@repo/synth'
import type { ConnectionPoint, EdgeId, NodeColor, NodeId, NodeType, NoteId } from './project'

export type ActionPayload =
  | {
      action: 'synth-node-create'
      id: NodeId
      type: NodeType
      position: { x: number; y: number }
      number: number
      color: NodeColor
    }
  | { action: 'synth-node-select'; id: NodeId; selected: boolean }
  | { action: 'synth-node-move'; id: NodeId; to: { x: number; y: number } }
  | { action: 'synth-node-delete'; id: NodeId }
  | {
      action: 'synth-edge-create'
      id: EdgeId
      source: ConnectionPoint
      target: ConnectionPoint
    }
  | { action: 'synth-edge-select'; id: EdgeId; selected: boolean }
  | { action: 'synth-edge-delete'; id: EdgeId }
  | { action: 'synth-node-param-set'; id: NodeId; param: string; value: string | number }
  | {
      action: 'sheet-note-create'
      id: NoteId
      synthId: NodeId
      time: SynthTime
      duration: SynthTime
      pitch: PitchNotation
    }
  | { action: 'sheet-note-select'; id: NoteId; selected: boolean }
  | { action: 'sheet-note-move'; id: NoteId; to: { time: SynthTime; pitch: PitchNotation } }
  | { action: 'sheet-note-delete'; id: NoteId }
  | { action: 'ending-note-set'; time: SynthTime }

export type Action = ActionPayload['action']

export const TRACKED_EDITOR_ACTIONS: Action[] = [
  'synth-node-create',
  'synth-node-move',
  'synth-node-delete',
  'synth-edge-create',
  'synth-edge-delete',
  'synth-node-param-set',
  'sheet-note-create',
  'sheet-note-move',
  'sheet-note-delete',
  'ending-note-set',
]
