import { Range } from '#math'
import { type Branded, createSafeBrand } from '#util/branded'

export type UnitName =
  | 'seconds'
  | 'notes'
  | 'decibels'
  | 'hertz'
  | 'normal'
  | 'audio'
  | 'nonNegative'
  | 'factor'
  | 'ticks'

export type UnitValueMap = { [U in UnitName]: Branded<number, U> }

export type UnitValue<TUnit extends UnitName> = UnitValueMap[TUnit]

type UnitMeta<TUnit extends UnitName> = Readonly<{
  range: Range
  min: UnitValue<TUnit>
  max: UnitValue<TUnit>
  is: (x: number) => x is UnitValue<TUnit>
  orThrow: (x: number) => UnitValue<TUnit>
  orClamp: (x: number) => UnitValue<TUnit>
}>

const createUnitMeta = <TUnit extends UnitName>(unitName: TUnit, range: Range): UnitMeta<TUnit> => {
  const [is, orThrow] = createSafeBrand(
    (x: number): x is UnitValue<TUnit> => range.includes(x),
    `the argument is not a valid ${unitName} value in range ${range}`,
  )

  const orClamp = (x: number) => range.clamp(x)

  return {
    range,
    min: orThrow(range.min),
    max: orThrow(range.max),
    is,
    orThrow,
    orClamp,
  } as unknown as UnitMeta<TUnit>
}

export const Unit: { readonly [U in UnitName]: UnitMeta<U> } = {
  seconds: createUnitMeta('seconds', Range.any),
  notes: createUnitMeta('notes', Range.any),
  decibels: createUnitMeta('decibels', Range.any),
  hertz: createUnitMeta('hertz', Range.positive),
  normal: createUnitMeta('normal', Range.normal),
  audio: createUnitMeta('audio', new Range(-1, 1)),
  nonNegative: createUnitMeta('nonNegative', Range.positive),
  factor: createUnitMeta('factor', Range.any),
  ticks: createUnitMeta('ticks', Range.any),
}

export const Seconds = Unit.seconds
export const Notes = Unit.notes
export const Decibels = Unit.decibels
export const Hertz = Unit.hertz
export const Normal = Unit.normal
export const Audio = Unit.audio
export const NonNegative = Unit.nonNegative
export const Factor = Unit.factor
export const Ticks = Unit.ticks

export type Seconds = UnitValue<'seconds'>
export type Notes = UnitValue<'notes'>
export type Decibels = UnitValue<'decibels'>
export type Hertz = UnitValue<'hertz'>
export type Normal = UnitValue<'normal'>
export type Audio = UnitValue<'audio'>
export type NonNegative = UnitValue<'nonNegative'>
export type Factor = UnitValue<'factor'>
export type Ticks = UnitValue<'ticks'>
