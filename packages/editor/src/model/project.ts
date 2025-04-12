import type { PitchNotation } from '@repo/synth'
import type { NODE_COLORS, NODE_TYPES } from '#meta'

declare const EDITOR_ID: unique symbol

export type NodeId = string & { [EDITOR_ID]?: 'node' }

export type NodeType = (typeof NODE_TYPES)[number]

export type NodePosition = { x: number; y: number }

export type NodeColor = (typeof NODE_COLORS)[number]

export type EdgeId = string & { [EDITOR_ID]?: 'edge' }

export type ConnectionPoint = { node: NodeId; socket: number }

export type NoteId = string & { [EDITOR_ID]?: 'note' }

export type Project = {
  synthTree: {
    nodes: Record<
      NodeId,
      {
        type: NodeType
        position: NodePosition
        params: Record<string, number | string>
        number: number
        color: NodeColor
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
  musicSheet: {
    endingNote: number
    notes: Record<
      NoteId,
      {
        synth: NodeId
        time: number
        duration: number
        pitch: PitchNotation
      }
    >
  }
}
