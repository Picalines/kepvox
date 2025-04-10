import type { PitchNotation } from '@repo/synth'
import type { CREATABLE_SYNTH_NODES } from './synth-node-meta'

declare const EDITOR_ID: unique symbol

export type NodeId = string & { [EDITOR_ID]?: 'node' }

export type NodeType = 'output' | keyof typeof CREATABLE_SYNTH_NODES

export type NodePosition = { x: number; y: number }

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
