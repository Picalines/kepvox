import { Hertz } from '#units'

const PITCH_NOTES = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'] as const
const PITCH_OCTAVES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const

export type PitchNote = (typeof PITCH_NOTES)[number]
export type PitchOctave = (typeof PITCH_OCTAVES)[number]
export type PitchNotation = `${PitchNote}${PitchOctave}`

type PitchMeta = {
  readonly notation: PitchNotation
  readonly note: PitchNote
  readonly octave: PitchOctave
  readonly octaveHalfIntervals: number
  readonly halfIntervals: number
  readonly isAccidental: boolean
  readonly hertz: Hertz
  readonly midi: number
}

type PitchNoteMeta = {
  readonly note: PitchNote
  readonly isAccidental: boolean
}

const OCTAVE0_HERTZ: Record<PitchNote, number> = {
  c: 16.35,
  'c#': 17.32,
  d: 18.35,
  'd#': 19.45,
  e: 20.6,
  f: 21.83,
  'f#': 23.12,
  g: 24.5,
  'g#': 25.96,
  a: 27.5,
  'a#': 29.14,
  b: 30.87,
}

type PitchNoteAlias<N extends PitchNote> = N extends `${infer L}#` ? Uppercase<L> : never
type PitchNotationAlias<P extends PitchNotation> = P extends `${infer L}#${infer O}` ? `${Uppercase<L>}${O}` : never

type AliasedPitchNote = PitchNote | PitchNoteAlias<PitchNote>
type AliasedPitchNotation = PitchNotation | PitchNotationAlias<PitchNotation>

type PitchTable = {
  [N in AliasedPitchNotation]: PitchMeta
} & {
  [N in AliasedPitchNote]: PitchNoteMeta
} & {
  [M: number]: PitchMeta | undefined
  names: typeof PITCH_NOTES
  octaves: typeof PITCH_OCTAVES
}

const createPitchTable = (): Readonly<PitchTable> => {
  const table = {
    names: PITCH_NOTES,
    octaves: PITCH_OCTAVES,
  } as PitchTable

  for (const note of PITCH_NOTES) {
    const isAccidental = note.includes('#')

    const noteMeta: PitchNoteMeta = { note, isAccidental }

    table[note] = noteMeta

    if (isAccidental) {
      table[note.slice(0, 1).toUpperCase() as AliasedPitchNote] = noteMeta
    }
  }

  for (const octave of PITCH_OCTAVES) {
    let octaveHalfIntervals = 0

    for (const note of PITCH_NOTES) {
      const notation: PitchNotation = `${note}${octave}`
      const halfIntervals = octave * 12 + octaveHalfIntervals

      const pitchMeta: PitchMeta = {
        notation,
        note,
        octave,
        octaveHalfIntervals,
        halfIntervals,
        isAccidental: note.includes('#'),
        hertz: Hertz(OCTAVE0_HERTZ[note] * 2 ** octave),
        midi: halfIntervals + 12, // C0 is MIDI note 12
      }

      table[notation] = pitchMeta

      if (note.includes('#')) {
        const sharpNoteAlias = notation.slice(0, 1).toUpperCase() as AliasedPitchNote
        const aliasNotation: AliasedPitchNotation = `${sharpNoteAlias}${octave}`
        table[aliasNotation] = pitchMeta
      }

      table[pitchMeta.midi] = pitchMeta

      octaveHalfIntervals++
    }
  }

  return table
}

export const Pitch = createPitchTable()
export type Pitch = PitchMeta
export type PitchBase = PitchNoteMeta
