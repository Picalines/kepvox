import type { Range } from '#math'
import type { SynthTime } from '#time'
import type { UnitName, UnitValue } from '#units'

export type InterpolationMethod = 'linear' | 'exponential'

export type AutomationEvent<TUnit extends UnitName> = {
  time: SynthTime
  value: UnitValue<TUnit>
  ramp?: { value: UnitValue<TUnit>; method: InterpolationMethod }
}

export type ReadonlyAutomationCurve<TUnit extends UnitName> = {
  get unit(): TUnit
  get timeRange(): [start: SynthTime, end: SynthTime]
  get valueRange(): Range

  valueAt(time: SynthTime): UnitValue<TUnit>
  areaBefore(time: SynthTime): number

  eventAt(time: SynthTime): AutomationEvent<TUnit> | null
  eventBefore(time: SynthTime): AutomationEvent<TUnit> | null
  eventBeforeOrAt(time: SynthTime): AutomationEvent<TUnit> | null
  eventAfter(time: SynthTime): AutomationEvent<TUnit> | null
  eventAfterOrAt(time: SynthTime): AutomationEvent<TUnit> | null

  eventsAfter(time: SynthTime): Iterable<AutomationEvent<TUnit>>
  eventsBefore(time: SynthTime): Iterable<AutomationEvent<TUnit>>
  eventsInRange(start: SynthTime, end: SynthTime): Iterable<AutomationEvent<TUnit>>
  eventSpan(time: SynthTime): [AutomationEvent<TUnit> | null, AutomationEvent<TUnit> | null]
}
