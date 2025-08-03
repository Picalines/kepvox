import { assertDefined } from '@repo/common/assert'
import { Notes, Pitch, type PitchNotation, Range, Time } from '@repo/synth'

const HIGHEST_PITCH: PitchNotation = 'b9'
const LOWEST_PITCH: PitchNotation = 'c0'
const NOTE_HALF_STEPS = Pitch[HIGHEST_PITCH].midi - Pitch[LOWEST_PITCH].midi + 1

export type MusicSheetDimensions = ReturnType<typeof musicSheetDimensions>

type Params = {
  wholeNoteWidthPx: number
  halfStepHeightPx: number
  timelineHeightPx: number
}

// NOTE: [0, 0] is top-left, +y goes down

export const musicSheetDimensions = (params: Params) => {
  const { wholeNoteWidthPx, halfStepHeightPx, timelineHeightPx } = params

  const sheetHeight = NOTE_HALF_STEPS * halfStepHeightPx + timelineHeightPx

  return {
    timeline: {
      height: timelineHeightPx,
    },
    sheet: {
      height: sheetHeight,
      top: 0,
      bottom: sheetHeight,
    },
    octave: {
      height: Pitch.names.length * halfStepHeightPx,
    },
    note: {
      height: halfStepHeightPx,
      width: (duration: Time) => duration.notes * wholeNoteWidthPx,
      left: (time: Time) => time.notes * wholeNoteWidthPx,
      top: (pitch: PitchNotation) => (Pitch[HIGHEST_PITCH].midi - Pitch[pitch].midi) * halfStepHeightPx,
      time: (left: number) => Time.atNote(Notes.orClamp(Range.positive.clamp(left / wholeNoteWidthPx))),
      pitch: (top: number) => {
        const nearestMidi = Math.ceil(-top / halfStepHeightPx + Pitch[HIGHEST_PITCH].midi)
        const midiPitch = Pitch[nearestMidi]
        assertDefined(midiPitch)
        return midiPitch.notation
      },
    },
  } as const
}
