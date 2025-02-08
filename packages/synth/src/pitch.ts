import { assertDefined } from '@repo/common/assert'
import { Hertz } from '#units'

const PITCH_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const

export type PitchName = (typeof PITCH_NAMES)[number]

const PITCH_OCTAVES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const

export type PitchOctave = (typeof PITCH_OCTAVES)[number]

export type PitchNotation = `${PitchName}${PitchOctave}`

type NotationMeta = {
  name: PitchName
  octave: PitchOctave
  octaveHalfIntervals: number
  halfIntervals: number
  isAccidental: boolean
  hertz: Hertz
}

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

const createNotationMetaMap = () => {
  const notationMeta = new Map<PitchNotation, NotationMeta>()

  let halfIntervals = 0

  for (const octave of PITCH_OCTAVES) {
    let octaveHalfIntervals = 0

    for (const pitchName of PITCH_NAMES) {
      notationMeta.set(`${pitchName}${octave}`, {
        name: pitchName,
        octave,
        octaveHalfIntervals,
        halfIntervals,
        isAccidental: pitchName.endsWith('#'),
        hertz: Hertz.orThrow(OCTAVE0_HERTZ[pitchName] * 2 ** octave),
      })

      halfIntervals++
      octaveHalfIntervals++
    }
  }

  return notationMeta
}

const NOTATION_META: ReadonlyMap<PitchNotation, NotationMeta> = createNotationMetaMap()

export const Pitch = {
  names: PITCH_NAMES,
  octaves: PITCH_OCTAVES,

  isNotation: (str: string): str is PitchNotation => NOTATION_META.has(str as PitchNotation),

  parseNotation: (notation: PitchNotation): NotationMeta => {
    const meta = NOTATION_META.get(notation)
    assertDefined(meta)
    return meta
  },

  frequency: (notation: PitchNotation) => Pitch.parseNotation(notation).hertz,
}
