import type { Signal } from '#signal'
import type { SynthTime } from '#time'

export type TimedEvent = {
  time: SynthTime
}

export type ReadonlyEventTimeline<TEvent extends TimedEvent> = {
  get timeRange(): [start: SynthTime, end: SynthTime]
  get changed(): Signal<{ event: TEvent }>
  get cancelled(): Signal<{ after: SynthTime }>

  eventAt(time: SynthTime): TEvent | null
  eventBefore(time: SynthTime): TEvent | null
  eventBeforeOrAt(time: SynthTime): TEvent | null
  eventAfter(time: SynthTime): TEvent | null
  eventAfterOrAt(time: SynthTime): TEvent | null

  eventsAfter(time: SynthTime): Iterable<TEvent>
  eventsBefore(time: SynthTime): Iterable<TEvent>
  eventsInRange(start: SynthTime, end: SynthTime): Iterable<TEvent>
  eventSpan(time: SynthTime): [beforeOrAt: TEvent | null, after: TEvent | null]
}
