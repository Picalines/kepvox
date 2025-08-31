import type { Signal } from '#signal'
import type { Time } from '#time'

export type TimedEvent = {
  time: Time
}

export type ReadonlyEventTimeline<TEvent extends TimedEvent> = {
  get timeRange(): [start: Time, end: Time]
  get changed(): Signal<TEvent>
  get cancelled(): Signal<{ after: Time; until?: Time }>

  eventAt(time: Time): TEvent | null
  eventBefore(time: Time): TEvent | null
  eventBeforeOrAt(time: Time): TEvent | null
  eventAfter(time: Time): TEvent | null
  eventAfterOrAt(time: Time): TEvent | null

  eventsAfter(time: Time): IteratorObject<TEvent>
  eventsAfterOrAt(time: Time): IteratorObject<TEvent>
  eventsBefore(time: Time): IteratorObject<TEvent>
  eventsBeforeOrAt(time: Time): IteratorObject<TEvent>
  eventsAfterUntil(after: Time, until: Time): IteratorObject<TEvent>
  eventSpan(time: Time): [beforeOrAt: TEvent | null, after: TEvent | null]
}
