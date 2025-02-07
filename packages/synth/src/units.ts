import { Range } from '#math'
import { type Branded, createBrandedUnsafe, createSafeBrand } from '#util/branded'

export type Seconds = Branded<number, 'seconds'>
export type Beats = Branded<number, 'beats'>
export type Decibels = Branded<number, 'decibels'>
export type Hertz = Branded<number, 'hertz'>
export type NormalRange = Branded<number, 'normalRange'>
export type AudioRange = Branded<number, 'audioRange'>
export type NonNegative = Branded<number, 'nonNegative'>
export type Factor = Branded<number, 'factor'>

export type UnitMap = {
  seconds: Seconds
  beats: Beats
  decibels: Decibels
  hertz: Hertz
  normalRange: NormalRange
  audioRange: AudioRange
  nonNegative: NonNegative
  factor: Factor
}

export type UnitName = keyof UnitMap

export type UnitValue<TUnit extends UnitName> = UnitMap[TUnit]

export const UNIT_RANGES: Record<UnitName, Range> = {
  seconds: Range.any,
  beats: Range.any,
  decibels: Range.any,
  hertz: Range.positive,
  normalRange: Range.normal,
  audioRange: new Range(-1, 1),
  nonNegative: Range.positive,
  factor: Range.any,
}

const unitRangePredicate = <U extends UnitName>(unit: U) => {
  return (x: number): x is Branded<number, U> => UNIT_RANGES[unit].includes(x)
}

export const [isSeconds, createSeconds] = createSafeBrand(
  unitRangePredicate('seconds'),
  'the argument is not a valid seconds value',
)

export const [isBeats, createBeats] = createSafeBrand(
  unitRangePredicate('beats'),
  'the argument is not a valid beats value',
)

export const [isDecibels, createDecibels] = createSafeBrand(
  unitRangePredicate('decibels'),
  'the argument is not a valid decibels value',
)

export const [isHertz, createHertz] = createSafeBrand(
  unitRangePredicate('hertz'),
  'the argument is not a valid hertz value (in range [0, +inf)])',
)

export const [isNormalRange, createNormalRange] = createSafeBrand(
  unitRangePredicate('normalRange'),
  'the argument is not in range [0, 1]',
)

export const clampToNormalRange = (x: number) => createBrandedUnsafe<NormalRange>(UNIT_RANGES.normalRange.clamp(x))

export const [isAudioRange, createAudioRange] = createSafeBrand(
  unitRangePredicate('audioRange'),
  'the argument is not in range [-1, 1]',
)

export const clampToAudioRange = (x: number) => createBrandedUnsafe<AudioRange>(UNIT_RANGES.audioRange.clamp(x))

export const [isNonNegative, createNonNegative] = createSafeBrand(
  unitRangePredicate('nonNegative'),
  'the argument is not in range [0, +inf]',
)

export const clampToNonNegative = (x: number) => createBrandedUnsafe<NonNegative>(UNIT_RANGES.nonNegative.clamp(x))

export const [isFactor, createFactor] = createSafeBrand(
  unitRangePredicate('factor'),
  'the argument is not a valid factor',
)
