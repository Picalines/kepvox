import { assertDefined, assertUnreachable, assertedAt } from '@repo/common/assert'
import { isNonEmpty } from '@repo/common/predicate'
import { Signal } from '#signal'
import type { Time } from '#time'
import type { ReadonlyEventTimeline, TimedEvent } from './readonly-event-timeline'

export class EventTimeline<TEvent extends TimedEvent> implements ReadonlyEventTimeline<TEvent> {
  readonly #changed = Signal.controlled<TEvent>()

  readonly #cancelled = Signal.controlled<{ after: Time; until?: Time }>()

  readonly #events: TEvent[] = []

  get changed() {
    return this.#changed.signal
  }

  get cancelled() {
    return this.#cancelled.signal
  }

  get timeRange(): [start: Time, end: Time] {
    if (!this.#events.length) {
      throw new Error(`${EventTimeline.name} has no events`)
    }

    const start = assertedAt(this.#events, 0)
    const end = assertedAt(this.#events, -1)
    return [start.time, end.time]
  }

  /**
   * Merges given event with an existing one at the {@link Time}
   */
  mergeEvent(event: TEvent) {
    const lastEventIndex = this.#eventIndexBeforeOrAt(event.time)

    const lastEvent = lastEventIndex !== null ? assertedAt(this.#events, lastEventIndex) : null

    let newEvent: TEvent

    if (lastEventIndex === null) {
      newEvent = event
      this.#events.unshift(newEvent)
    } else if (lastEvent?.time.equals(event.time)) {
      newEvent = { ...lastEvent, ...event }
      this.#events.splice(lastEventIndex, 1, newEvent)
    } else {
      newEvent = event
      this.#events.splice(lastEventIndex + 1, 0, newEvent)
    }

    this.#changed.emit(newEvent)
  }

  cancelEventsAfter(time: Time) {
    const cutIndex = this.#eventIndexAfter(time)
    if (cutIndex !== null) {
      this.#events.splice(cutIndex)
      this.#cancelled.emit({ after: time })
    }
  }

  cancelEventsAfterUntil(after: Time, until: Time) {
    if (!until.isAfter(after)) {
      return
    }

    const afterIndex = this.#eventIndexAfter(after)
    const untilIndex = this.#eventIndexBefore(until)
    if (afterIndex !== null && untilIndex !== null) {
      this.#events.splice(afterIndex, untilIndex - afterIndex + 1)
      this.#cancelled.emit({ after, until })
    }
  }

  eventAt(time: Time): TEvent | null {
    const lastEvent = this.#events[this.#eventIndexBeforeOrAt(time) ?? -1] ?? null
    return lastEvent?.time.equals(time) ? lastEvent : null
  }

  eventBefore(time: Time): TEvent | null {
    return this.#events[this.#eventIndexBefore(time) ?? -1] ?? null
  }

  eventBeforeOrAt(time: Time): TEvent | null {
    return this.#events[this.#eventIndexBeforeOrAt(time) ?? -1] ?? null
  }

  eventAfter(time: Time): TEvent | null {
    return this.#events[this.#eventIndexAfter(time) ?? -1] ?? null
  }

  eventAfterOrAt(time: Time): TEvent | null {
    return this.#events[this.#eventIndexAfterOrAt(time) ?? -1] ?? null
  }

  *eventsAfter(time: Time): Generator<TEvent, void, undefined> {
    const startIndex = this.#eventIndexAfter(time) ?? this.#events.length
    for (let i = startIndex; i < this.#events.length; i++) {
      yield assertedAt(this.#events, i)
    }
  }

  *eventsAfterOrAt(time: Time): Generator<TEvent, void, undefined> {
    const startIndex = this.#eventIndexAfterOrAt(time) ?? this.#events.length
    for (let i = startIndex; i < this.#events.length; i++) {
      yield assertedAt(this.#events, i)
    }
  }

  *eventsBefore(time: Time): Generator<TEvent, void, undefined> {
    const stopIndex = this.#eventIndexBefore(time) ?? -1
    for (let i = 0; i <= stopIndex; i++) {
      yield assertedAt(this.#events, i)
    }
  }

  *eventsBeforeOrAt(time: Time): Generator<TEvent, void, undefined> {
    const stopIndex = this.#eventIndexBeforeOrAt(time) ?? -1
    for (let i = 0; i <= stopIndex; i++) {
      yield assertedAt(this.#events, i)
    }
  }

  eventSpan(time: Time): [TEvent | null, TEvent | null] {
    return [this.eventBeforeOrAt(time), this.eventAfter(time)]
  }

  #eventIndexBeforeOrAt(time: Time): number | null {
    const events = this.#events
    if (!isNonEmpty(events)) {
      return null
    }

    const firstEvent = events[0]
    if (firstEvent.time.isAfter(time)) {
      return null
    }

    const lastEvent = events[events.length - 1]
    if (lastEvent?.time.isBeforeOrAt(time)) {
      return events.length - 1
    }

    let start = 0
    let end = events.length - 1

    while (start <= end) {
      const middle = Math.floor(start + (end - start) / 2)
      const middleEvent = this.#events[middle]
      const nextEvent = this.#events[middle + 1]
      assertDefined(middleEvent)
      assertDefined(nextEvent)

      if (time.isAfterOrAt(middleEvent.time) && time.isBefore(nextEvent.time)) {
        return middle
      }

      if (middleEvent.time.isBefore(time)) {
        start = middle + 1
      } else {
        end = middle - 1
      }
    }

    assertUnreachable(`${EventTimeline} search failed`)
  }

  #eventIndexBefore(time: Time): number | null {
    const lastIndex = this.#eventIndexBeforeOrAt(time)
    if (lastIndex === null) {
      return null
    }

    const lastEvent = assertedAt(this.#events, lastIndex)
    return lastEvent.time.equals(time) ? this.#eventIndexOrNull(lastIndex - 1) : lastIndex
  }

  #eventIndexAfterOrAt(time: Time): number | null {
    const lastIndex = this.#eventIndexBeforeOrAt(time)
    if (lastIndex === null) {
      return this.#eventIndexOrNull(0)
    }

    const lastEvent = assertedAt(this.#events, lastIndex)
    return lastEvent.time.equals(time) ? lastIndex : this.#eventIndexOrNull(lastIndex + 1)
  }

  #eventIndexAfter(time: Time): number | null {
    const lastIndex = this.#eventIndexBeforeOrAt(time)
    if (lastIndex === null) {
      return this.#eventIndexOrNull(0)
    }

    return this.#eventIndexOrNull(lastIndex + 1)
  }

  #eventIndexOrNull(index: number): number | null {
    return this.#events.length > 0 && index >= 0 && index < this.#events.length ? index : null
  }
}
