import type { PitchNotation, Time, TimeSignature } from '@repo/synth'
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
  | { action: 'synth-node-param-set'; id: NodeId; param: string; value: string | number }
  | { action: 'synth-node-color-set'; id: NodeId; color: NodeColor }
  | { action: 'synth-edge-select'; id: EdgeId; selected: boolean }
  | { action: 'synth-edge-delete'; id: EdgeId }
  | {
      action: 'sheet-note-create'
      id: NoteId
      synthId: NodeId
      time: Time
      duration: Time
      pitch: PitchNotation
    }
  | { action: 'sheet-note-select'; id: NoteId; selected: boolean }
  | { action: 'sheet-note-move'; id: NoteId; to: { time: Time; pitch: PitchNotation } }
  | { action: 'sheet-note-delete'; id: NoteId }
  | { action: 'time-signature-set'; timeSignature: TimeSignature }
  | { action: 'beats-per-minute-set'; beatsPerMinute: number }
  | { action: 'ending-note-set'; time: Time }

export type Action = ActionPayload['action']

export const TRACKED_EDITOR_ACTIONS: Action[] = [
  'synth-node-create',
  'synth-node-move',
  'synth-node-delete',
  'synth-node-param-set',
  'synth-node-color-set',
  'synth-edge-create',
  'synth-edge-delete',
  'sheet-note-create',
  'sheet-note-move',
  'sheet-note-delete',
  'time-signature-set',
  'beats-per-minute-set',
  'ending-note-set',
]
