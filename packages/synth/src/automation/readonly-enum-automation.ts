import type { Time } from '#time'
import type { ReadonlyEventTimeline } from './readonly-event-timeline'

export type EnumAutomationEvent<E extends string> = {
  time: Time
  value: E
}

export type ReadonlyEnumAutomation<E extends string> = ReadonlyEventTimeline<EnumAutomationEvent<E>> & {
  get timeRange(): [start: Time, end: Time]
  get values(): readonly E[]

  valueAt(time: Time): E
}
