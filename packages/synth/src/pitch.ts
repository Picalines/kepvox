import { assertDefined } from '@repo/common/assert'
import { IntRange } from '#math'
import { Hertz } from '#units'

const PITCH_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const

export type PitchName = (typeof PITCH_NAMES)[number]

const PITCH_OCTAVES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const

export type PitchOctave = (typeof PITCH_OCTAVES)[number]

export type PitchNotation = `${PitchName}${PitchOctave}`

type NotationMeta = Readonly<{
  notation: PitchNotation
  name: PitchName
  octave: PitchOctave
  octaveHalfIntervals: number
  halfIntervals: number
  isAccidental: boolean
  hertz: Hertz
  midi: number
}>

type PitchNameMeta = Readonly<{
  name: PitchName
  isAccidental: boolean
}>

const OCTAVE0_HERTZ: Record<PitchName, number> = {
  C: 16.35,
  'C#': 17.32,
  D: 18.35,
  'D#': 19.45,
  E: 20.6,
  F: 21.83,
  'F#': 23.12,
  G: 24.5,
  'G#': 25.96,
  A: 27.5,
  'A#': 29.14,
  B: 30.87,
}

const createPitchTable = () => {
  const byNotation = new Map<PitchNotation, NotationMeta>()
  const byMidi = new Map<number, NotationMeta>()

  let halfIntervals = 0
  let midiNote = 16 // MIDI code for C0

  for (const octave of PITCH_OCTAVES) {
    let octaveHalfIntervals = 0

    for (const pitchName of PITCH_NAMES) {
      const notation: PitchNotation = `${pitchName}${octave}`

      const meta: NotationMeta = {
        notation,
        name: pitchName,
        octave,
        octaveHalfIntervals,
        halfIntervals,
        isAccidental: pitchName.endsWith('#'),
        hertz: Hertz(OCTAVE0_HERTZ[pitchName] * 2 ** octave),
        midi: midiNote,
      }

      byNotation.set(notation, meta)
      byMidi.set(midiNote, meta)

      halfIntervals++
      octaveHalfIntervals++
      midiNote++
    }
  }

  return { byNotation, byMidi } as const
}

const createPitchNameTable = () => {
  const byName = new Map<PitchName, PitchNameMeta>()

  for (const name of PITCH_NAMES) {
    byName.set(name, { name, isAccidental: name.endsWith('#') })
  }

  return { byName } as const
}

const PITCH_TABLE = createPitchTable()
const PITCH_NAME_TABLE = createPitchNameTable()

const LOWEST_PITCH = PITCH_TABLE.byNotation.get('C0')
const HIGHEST_PITCH = PITCH_TABLE.byNotation.get('B9')
assertDefined(LOWEST_PITCH)
assertDefined(HIGHEST_PITCH)

export const Pitch = {
  names: PITCH_NAMES,
  octaves: PITCH_OCTAVES,

  lowest: LOWEST_PITCH,
  highest: HIGHEST_PITCH,

  midiRange: new IntRange(LOWEST_PITCH.midi, HIGHEST_PITCH.midi),

  isNotation: (str: string): str is PitchNotation => PITCH_TABLE.byNotation.has(str as PitchNotation),

  parseNotation: (notation: PitchNotation): NotationMeta => {
    const meta = PITCH_TABLE.byNotation.get(notation)
    assertDefined(meta)
    return meta
  },

  parseMidi: (midi: number): NotationMeta => {
    const meta = PITCH_TABLE.byMidi.get(midi)
    assertDefined(meta)
    return meta
  },

  parseName: (name: PitchName): PitchNameMeta => {
    const meta = PITCH_NAME_TABLE.byName.get(name)
    assertDefined(meta)
    return meta
  },

  frequency: (notation: PitchNotation) => Pitch.parseNotation(notation).hertz,

  midi: (notation: PitchNotation) => Pitch.parseNotation(notation).midi,
}
