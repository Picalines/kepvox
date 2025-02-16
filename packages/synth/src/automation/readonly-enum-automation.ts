import type { SynthTime } from '#time'
import type { ReadonlyEventTimeline } from './readonly-event-timeline'

export type EnumAutomationEvent<E extends string> = {
  time: SynthTime
  value: E
}

export type ReadonlyEnumAutomation<E extends string> = ReadonlyEventTimeline<EnumAutomationEvent<E>> & {
  get timeRange(): [start: SynthTime, end: SynthTime]
  get values(): readonly E[]

  valueAt(time: SynthTime): E
}
