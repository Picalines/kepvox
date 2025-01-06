import { type Branded, createBrandedUnsafe, createSafeBrand } from '@repo/common/branded'
import { clamp } from '@repo/common/math'

export type UnitMap = {
  seconds: Seconds
  decibels: Decibels
  normalRange: NormalRange
  audioRange: AudioRange
  nonNegative: NonNegative
  factor: Factor
}

export type UnitName = keyof UnitMap

export type Seconds = Branded<number, 'seconds'>

export const [isSeconds, createSeconds] = createSafeBrand(
  (x: number): x is Seconds => Number.isFinite(x),
  'the argument is not a valid seconds value',
)

export type Decibels = Branded<number, 'decibels'>

export const [isDecibels, createDecibels] = createSafeBrand(
  (x: number): x is Decibels => Number.isFinite(x) || x === Number.NEGATIVE_INFINITY,
  'the argument is not a valid decibels value',
)

export type Hertz = Branded<number, 'hertz'>

export const [isHertz, createHertz] = createSafeBrand(
  (x: number): x is Hertz => Number.isFinite(x) && x >= 0,
  'the argument is not a valid hertz value (in range [0, +inf)])',
)

/**
 * A number between [0, 1]
 */
export type NormalRange = Branded<number, 'normalRange'>

export const [isNormalRange, createNormalRange] = createSafeBrand(
  (x: number): x is NormalRange => Number.isFinite(x) && x >= 0 && x <= 1,
  'the argument is not in range [0, 1]',
)

export const clampToNormalRange = (x: number) => createBrandedUnsafe<NormalRange>(clamp(x, 0, 1))

/**
 * A number between [-1, 1]
 */
export type AudioRange = Branded<number, 'audioRange'>

export const [isAudioRange, createAudioRange] = createSafeBrand(
  (x: number): x is AudioRange => Number.isFinite(x) && x >= -1 && x <= 1,
  'the argument is not in range [-1, 1]',
)

export const clampToAudioRange = (x: number) => createBrandedUnsafe<AudioRange>(clamp(x, -1, 1))

export type NonNegative = Branded<number, 'nonNegative'>

export const [isNonNegative, createNonNegative] = createSafeBrand(
  (x: number): x is NonNegative => x >= 0,
  'the argument is not in range [0, +inf]',
)

export const clampToNonNegative = (x: number) => createBrandedUnsafe<NonNegative>(clamp(x, 0, Number.POSITIVE_INFINITY))

/**
 * A multiplication factor
 */
export type Factor = Branded<number, 'factor'>

export const createFactor = (factor: number) => createBrandedUnsafe<Factor>(factor)
