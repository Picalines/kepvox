import type { Signal } from '#signal'
import type { Time } from '#time'

export type TimedEvent = {
  time: Time
}

export type ReadonlyEventTimeline<TEvent extends TimedEvent> = {
  get timeRange(): [start: Time, end: Time]
  get changed(): Signal<{ event: TEvent }>
  get cancelled(): Signal<{ after: Time }>

  eventAt(time: Time): TEvent | null
  eventBefore(time: Time): TEvent | null
  eventBeforeOrAt(time: Time): TEvent | null
  eventAfter(time: Time): TEvent | null
  eventAfterOrAt(time: Time): TEvent | null

  eventsAfter(time: Time): Iterable<TEvent>
  eventsBefore(time: Time): Iterable<TEvent>
  eventsInRange(start: Time, end: Time): Iterable<TEvent>
  eventSpan(time: Time): [beforeOrAt: TEvent | null, after: TEvent | null]
}
