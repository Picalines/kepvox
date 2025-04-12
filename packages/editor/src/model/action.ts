import type { PitchNotation, SynthTime } from '@repo/synth'
import type { ConnectionPoint, EdgeId, NodeColor, NodeId, NodeType, NoteId } from './project'

export type ActionPayload =
  | {
      action: 'synth-node-created'
      id: NodeId
      type: NodeType
      position: { x: number; y: number }
      number: number
      color: NodeColor
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
  | {
      action: 'sheet-note-created'
      id: NoteId
      synthId: NodeId
      time: SynthTime
      duration: SynthTime
      pitch: PitchNotation
    }
  | { action: 'sheet-note-selected'; id: NoteId; selected: boolean }
  | { action: 'sheet-note-moved'; id: NoteId; to: { time: SynthTime; pitch: PitchNotation } }
  | { action: 'sheet-note-deleted'; id: NoteId }
  | { action: 'ending-note-set'; time: SynthTime }

export type Action = ActionPayload['action']

export const TRACKED_EDITOR_ACTIONS: Action[] = [
  'synth-node-created',
  'synth-node-moved',
  'synth-node-deleted',
  'synth-edge-created',
  'synth-edge-deleted',
  'synth-node-param-set',
  'sheet-note-created',
  'sheet-note-moved',
  'sheet-note-deleted',
  'ending-note-set',
]
