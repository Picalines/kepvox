import { type Branded, createBrandedUnsafe, createSafeBrand } from '@repo/common/branded'
import { type Range, clamp, isInRange } from '@repo/common/math'

export type Seconds = Branded<number, 'seconds'>
export type Decibels = Branded<number, 'decibels'>
export type Hertz = Branded<number, 'hertz'>
export type NormalRange = Branded<number, 'normalRange'>
export type AudioRange = Branded<number, 'audioRange'>
export type NonNegative = Branded<number, 'nonNegative'>
export type Factor = Branded<number, 'factor'>

export type UnitMap = {
  seconds: Seconds
  decibels: Decibels
  hertz: Hertz
  normalRange: NormalRange
  audioRange: AudioRange
  nonNegative: NonNegative
  factor: Factor
}

export type UnitName = keyof UnitMap

export const UNIT_RANGES: Record<UnitName, Range> = {
  seconds: [Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY],
  decibels: [Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY],
  hertz: [0, 24000],
  normalRange: [0, 1],
  audioRange: [-1, 1],
  nonNegative: [0, Number.POSITIVE_INFINITY],
  factor: [Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY],
}

const unitRangePredicate = <U extends UnitName>(unit: U) => {
  return (x: number): x is Branded<number, U> => isInRange(x, UNIT_RANGES[unit])
}

export const [isSeconds, createSeconds] = createSafeBrand(
  unitRangePredicate('seconds'),
  'the argument is not a valid seconds value',
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

export const clampToNormalRange = (x: number) => createBrandedUnsafe<NormalRange>(clamp(x, UNIT_RANGES.normalRange))

export const [isAudioRange, createAudioRange] = createSafeBrand(
  unitRangePredicate('audioRange'),
  'the argument is not in range [-1, 1]',
)

export const clampToAudioRange = (x: number) => createBrandedUnsafe<AudioRange>(clamp(x, UNIT_RANGES.audioRange))

export const [isNonNegative, createNonNegative] = createSafeBrand(
  unitRangePredicate('nonNegative'),
  'the argument is not in range [0, +inf]',
)

export const clampToNonNegative = (x: number) => createBrandedUnsafe<NonNegative>(clamp(x, UNIT_RANGES.nonNegative))

export const [isFactor, createFactor] = createSafeBrand(
  unitRangePredicate('factor'),
  'the argument is not a valid factor',
)
