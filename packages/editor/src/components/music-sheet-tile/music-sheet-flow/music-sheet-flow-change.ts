import { step } from '@repo/common/math'
import { Notes, Time } from '@repo/synth'
import type { NodeChange as FlowNodeChange } from '@xyflow/react'
import type { ActionPayload } from '#model'
import type { MusicSheetDimensions } from '../music-sheet-dimensions'

type MapNodeChangeParams = {
  dimensions: MusicSheetDimensions
  timeStep: number
  change: FlowNodeChange
}

export const musicSheetNodeChangeToAction = (params: MapNodeChangeParams): ActionPayload | null => {
  const { dimensions, timeStep, change } = params

  switch (change.type) {
    case 'position': {
      const { id, position } = change
      if (!position) {
        break
      }

      const { x, y } = position

      const time = Time.atNote(Notes.orClamp(step(dimensions.note.time(x).toNotes(), timeStep)))
      const pitch = dimensions.note.pitch(y)

      return { action: 'sheet-note-move', id, to: { time, pitch } }
    }

    case 'remove': {
      const { id } = change
      return { action: 'sheet-note-delete', id }
    }

    case 'select': {
      const { id, selected } = change
      return { action: 'sheet-note-select', id, selected }
    }
  }

  return null
}
