import type { Range } from '#math'
import type { SynthTime } from '#time'
import type { UnitName, UnitValue } from '#units'
import type { ReadonlyEventTimeline } from './readonly-event-timeline'

export type InterpolationMethod = 'linear' | 'exponential'

export type AutomationCurveEvent<TUnit extends UnitName> = {
  time: SynthTime
  value: UnitValue<TUnit>
  ramp?: { value: UnitValue<TUnit>; method: InterpolationMethod }
}

export type ReadonlyAutomationCurve<TUnit extends UnitName> = ReadonlyEventTimeline<AutomationCurveEvent<TUnit>> & {
  get unit(): TUnit
  get valueRange(): Range

  valueAt(time: SynthTime): UnitValue<TUnit>
  areaBefore(time: SynthTime): number
}
