import { Notes, Pitch, type PitchNotation, Range, SynthTime } from '@repo/synth'

const HIGHEST_PITCH: PitchNotation = 'B9'

const LOWEST_PITCH: PitchNotation = 'C0'

export const NOTE_HALF_STEPS = Pitch.midi(HIGHEST_PITCH) - Pitch.midi(LOWEST_PITCH) + 1

export type MusicSheetDimensions = ReturnType<typeof musicSheetDimensions>

type Params = {
  wholeNoteWidthPx: number
  halfStepHeightPx: number
}

// NOTE: [0, 0] is top-left, +y goes down

export const musicSheetDimensions = (params: Params) => {
  const { wholeNoteWidthPx, halfStepHeightPx } = params

  const sheetHeight = NOTE_HALF_STEPS * halfStepHeightPx

  return {
    sheet: {
      height: sheetHeight,
      top: 0,
      bottom: sheetHeight,
    },
    note: {
      height: halfStepHeightPx,
      width: (duration: SynthTime) => duration.toNotes() * wholeNoteWidthPx,
      left: (time: SynthTime) => time.toNotes() * wholeNoteWidthPx,
      top: (pitch: PitchNotation) => (Pitch.midi(HIGHEST_PITCH) - Pitch.midi(pitch)) * halfStepHeightPx,

      time: (left: number) => SynthTime.fromNotes(Notes.orClamp(Range.positive.clamp(left / wholeNoteWidthPx))),
      pitch: (top: number) =>
        Pitch.parseMidi(Pitch.midiRange.clamp(-top / halfStepHeightPx + Pitch.midi(HIGHEST_PITCH), 'ceil')).notation,
    },
  } as const
}
