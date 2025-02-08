import { Range } from '#math'
import { type Branded, createSafeBrand } from '#util/branded'

export type Seconds = Branded<number, 'seconds'>
export type Beats = Branded<number, 'beats'>
export type Notes = Branded<number, 'notes'>
export type Decibels = Branded<number, 'decibels'>
export type Hertz = Branded<number, 'hertz'>
export type NormalRange = Branded<number, 'normal'>
export type AudioRange = Branded<number, 'audio'>
export type NonNegative = Branded<number, 'nonNegative'>
export type Factor = Branded<number, 'factor'>

export type UnitMap = {
  seconds: Seconds
  beats: Beats
  notes: Notes
  decibels: Decibels
  hertz: Hertz
  normal: NormalRange
  audio: AudioRange
  nonNegative: NonNegative
  factor: Factor
}

export type UnitName = keyof UnitMap

export type UnitValue<TUnit extends UnitName> = UnitMap[TUnit]

type UnitMeta<TUnit extends UnitName> = Readonly<{
  range: Range
  min: UnitValue<TUnit>
  max: UnitValue<TUnit>
  is: (x: number) => x is UnitValue<TUnit>
  orThrow: (x: number) => UnitValue<TUnit>
  orClamp: (x: number) => UnitValue<TUnit>
}>

const createUnitMeta = <TUnit extends UnitName>(range: Range): UnitMeta<TUnit> => {
  const [is, orThrow] = createSafeBrand(
    (x: number): x is UnitValue<TUnit> => range.includes(x),
    `the argument is not in range ${range}`,
  )

  const orClamp = (x: number) => range.clamp(x)

  return { range, min: orThrow(range.min), max: orThrow(range.max), is, orThrow, orClamp } as unknown as UnitMeta<TUnit>
}

export const Unit: { readonly [U in UnitName]: UnitMeta<U> } = {
  seconds: createUnitMeta<'seconds'>(Range.any),
  beats: createUnitMeta<'beats'>(Range.any),
  notes: createUnitMeta<'notes'>(Range.any),
  decibels: createUnitMeta<'decibels'>(Range.any),
  hertz: createUnitMeta<'hertz'>(Range.positive),
  normal: createUnitMeta<'normal'>(Range.normal),
  audio: createUnitMeta<'audio'>(new Range(-1, 1)),
  nonNegative: createUnitMeta<'nonNegative'>(Range.positive),
  factor: createUnitMeta<'factor'>(Range.any),
}
