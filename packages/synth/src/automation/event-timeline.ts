import { isNonEmpty } from '@repo/common/array'
import { assertDefined, assertUnreachable, assertedAt } from '@repo/common/assert'
import type { SynthTime } from '#time'
import type { ReadonlyEventTimeline, TimedEvent } from './readonly-event-timeline'
import { Signal } from '#util/signal'

export class EventTimeline<TEvent extends TimedEvent> implements ReadonlyEventTimeline<TEvent> {
  readonly #changed = Signal.controlled<{ event: TEvent }>()

  readonly #events: TEvent[] = []

  get timeRange(): [start: SynthTime, end: SynthTime] {
    const start = assertedAt(this.#events, 0)
    const end = assertedAt(this.#events, -1)
    return [start.time, end.time]
  }

  mergeEvent(event: TEvent) {
    const lastEventIndex = this.#eventIndexBeforeOrAt(event.time)

    const lastEvent = lastEventIndex !== null ? assertedAt(this.#events, lastEventIndex) : null

    let newEvent: TEvent

    if (lastEventIndex === null) {
      newEvent = event
      this.#events.push(newEvent)
    } else if (lastEvent?.time.equals(event.time)) {
      newEvent = { ...lastEvent, ...event }
      this.#events.splice(lastEventIndex, 1, newEvent)
    } else {
      newEvent = event
      this.#events.splice(lastEventIndex + 1, 0, newEvent)
    }

    this.#changed.emit({ event: newEvent })
  }

  eventAt(time: SynthTime): TEvent | null {
    return this.#events[this.#eventIndexAfterOrAt(time) ?? -1] ?? null
  }

  eventBefore(time: SynthTime): TEvent | null {
    return this.#events[this.#eventIndexBefore(time) ?? -1] ?? null
  }

  eventBeforeOrAt(time: SynthTime): TEvent | null {
    return this.#events[this.#eventIndexBeforeOrAt(time) ?? -1] ?? null
  }

  eventAfter(time: SynthTime): TEvent | null {
    return this.#events[this.#eventIndexAfter(time) ?? -1] ?? null
  }

  eventAfterOrAt(time: SynthTime): TEvent | null {
    return this.#events[this.#eventIndexAfterOrAt(time) ?? -1] ?? null
  }

  *eventsAfter(time: SynthTime): Generator<TEvent, void, undefined> {
    const startIndex = this.#eventIndexAfter(time) ?? this.#events.length
    for (let i = startIndex; i < this.#events.length; i++) {
      yield assertedAt(this.#events, i)
    }
  }

  *eventsBefore(time: SynthTime): Generator<TEvent, void, undefined> {
    const stopIndex = this.#eventIndexBefore(time) ?? -1
    for (let i = 0; i <= stopIndex; i++) {
      yield assertedAt(this.#events, i)
    }
  }

  *eventsInRange(start: SynthTime, end: SynthTime): Generator<TEvent, void, undefined> {
    const startIndex = this.#eventIndexAfterOrAt(start) ?? 0
    const endIndex = this.#eventIndexBeforeOrAt(end) ?? this.#events.length - 1
    for (let i = startIndex; i <= endIndex; i++) {
      yield assertedAt(this.#events, i)
    }
  }

  eventSpan(time: SynthTime): [TEvent | null, TEvent | null] {
    return [this.eventBeforeOrAt(time), this.eventAfter(time)]
  }

  #eventIndexBeforeOrAt(time: SynthTime): number | null {
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

  #eventIndexBefore(time: SynthTime): number | null {
    const lastIndex = this.#eventIndexBeforeOrAt(time)
    return lastIndex !== null
      ? this.#events[lastIndex]?.time.equals(time)
        ? this.#eventIndexOrNull(lastIndex - 1)
        : lastIndex
      : null
  }

  #eventIndexAfterOrAt(time: SynthTime): number | null {
    const lastIndex = this.#eventIndexBeforeOrAt(time)
    return lastIndex !== null
      ? this.#events[lastIndex]?.time.isBefore(time)
        ? this.#eventIndexOrNull(lastIndex + 1)
        : lastIndex
      : null
  }

  #eventIndexAfter(time: SynthTime): number | null {
    const lastIndex = this.#eventIndexBeforeOrAt(time)
    return lastIndex !== null ? this.#eventIndexOrNull(lastIndex + 1) : null
  }

  #eventIndexOrNull(index: number): number | null {
    return this.#events.length > 0 && index >= 0 && index < this.#events.length ? index : null
  }
}
