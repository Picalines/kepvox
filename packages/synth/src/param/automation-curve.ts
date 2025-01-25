import { isNonEmpty } from '@repo/common/array'
import { assertDefined, assertUnreachable, assertedAt } from '@repo/common/assert'
import { Range } from '@repo/common/math'
import type { SynthContext, SynthTime } from '#context'

export type InterpolationMethod = 'linear' | 'exponential'

type AutomationEvent = {
  time: SynthTime
  value: number
  ramp?: InterpolationMethod
}

type InternalAutomationEvent = AutomationEvent & {
  /**
   * Area of a segment between this event and the next one.
   * undefined if cant be determined
   */
  _area?: number
}

export namespace AutomationCurve {
  export type Opts = {
    valueRange?: Range
  }
}

export class AutomationCurve {
  readonly #context: SynthContext

  readonly #valueRange: Range

  readonly #events: InternalAutomationEvent[] = []

  constructor(context: SynthContext, opts?: AutomationCurve.Opts) {
    this.#context = context
    this.#valueRange = opts?.valueRange ?? Range.any
  }

  /**
   * Schedules an event, when value will instantly jump to the specified value
   */
  setValueAt(time: SynthTime, value: number) {
    this.#addEvent({ time, value: this.#processValue(value) })
  }

  /**
   * Schedules an event, when the value will *stop ramping* to the specified value
   */
  rampValueUntil(end: SynthTime, value: number, method: InterpolationMethod = 'linear') {
    this.#addEvent({ time: end, value: this.#processValue(value), ramp: method })
  }

  /**
   * Cancels events after the specified time and inserts an
   * event that will hold the old value at the time
   */
  holdValueAt(time: SynthTime) {
    const value = this.valueAt(time)
    const nextEvent = this.eventAfterOrAt(time)
    this.#addEvent({ ...nextEvent, time, value })
    this.cancelEventsAfter(time)
  }

  /**
   * @returns curve value at a given time
   */
  valueAt(time: SynthTime): number {
    this.#assertContext(time)
    this.#assertNotEmpty()

    const [before, after] = this.eventSpan(time)

    if (!before && after) {
      return after.value
    }

    if (before && !after) {
      return before.value
    }

    assertDefined(before)
    assertDefined(after)

    if (!after.ramp) {
      return before.value
    }

    return interpolationTable[after.ramp](before.time.beats, before.value, after.time.beats, after.value, time.beats)
  }

  areaBefore(time: SynthTime): number {
    this.#assertNotEmpty()

    const lastEvent = this.eventBeforeOrAt(time)
    if (!lastEvent) {
      throw new Error("can't evaluate area before start")
    }

    const beforeArea = this.eventsBefore(lastEvent.time).reduce(
      (sum, event, index) => sum + ((event as InternalAutomationEvent)._area ?? this.#updateSpanArea(index) ?? 0),
      0,
    )

    return beforeArea + this.#spanAreaAt(this.eventSpan(time), time)
  }

  /**
   * Cancels all scheduled events after the specified time
   */
  cancelEventsAfter(time: SynthTime) {
    this.#assertContext(time)
    const cutIndex = this.#eventIndexAfter(time)
    if (cutIndex !== null) {
      this.#events.splice(cutIndex)
      this.#updateSpanArea(this.#events.length - 1)
    }
  }

  eventAt(time: SynthTime): AutomationEvent | null {
    const event = this.#events[this.#eventIndexAfterOrAt(time) ?? -1] ?? null
    return event?.time.equals(time) ? event : null
  }

  eventBefore(time: SynthTime): AutomationEvent | null {
    return this.#events[this.#eventIndexBefore(time) ?? -1] ?? null
  }

  eventBeforeOrAt(time: SynthTime): AutomationEvent | null {
    return this.#events[this.#eventIndexBeforeOrAt(time) ?? -1] ?? null
  }

  eventAfter(time: SynthTime): AutomationEvent | null {
    return this.#events[this.#eventIndexAfter(time) ?? -1] ?? null
  }

  eventAfterOrAt(time: SynthTime): AutomationEvent | null {
    return this.#events[this.#eventIndexAfterOrAt(time) ?? -1] ?? null
  }

  *eventsAfter(time: SynthTime): Generator<AutomationEvent, void, undefined> {
    const startIndex = this.#eventIndexAfter(time) ?? this.#events.length
    for (let i = startIndex; i < this.#events.length; i++) {
      yield assertedAt(this.#events, i)
    }
  }

  *eventsBefore(time: SynthTime): Generator<AutomationEvent, void, undefined> {
    const stopIndex = this.#eventIndexBefore(time) ?? -1
    for (let i = 0; i <= stopIndex; i++) {
      yield assertedAt(this.#events, i)
    }
  }

  *eventsInRange(start: SynthTime, end: SynthTime): Generator<AutomationEvent, void, undefined> {
    const startIndex = this.#eventIndexAfterOrAt(start) ?? 0
    const endIndex = this.#eventIndexBeforeOrAt(end) ?? this.#events.length - 1
    for (let i = startIndex; i <= endIndex; i++) {
      yield assertedAt(this.#events, i)
    }
  }

  eventSpan(time: SynthTime): [AutomationEvent | null, AutomationEvent | null] {
    return [this.eventBeforeOrAt(time), this.eventAfter(time)]
  }

  #processValue(value: number) {
    return this.#valueRange.clamp(value)
  }

  #addEvent(event: AutomationEvent) {
    const lastIndex = this.#eventIndexBeforeOrAt(event.time)

    if (lastIndex === null) {
      this.#events.push(event)
      this.#updateSpanArea(this.#events.length - 2)
      this.#updateSpanArea(this.#events.length - 1)
    } else if (this.#events[lastIndex]?.time.equals(event.time)) {
      this.#events.splice(lastIndex, 1, event)
      this.#updateSpanArea(lastIndex - 1)
      this.#updateSpanArea(lastIndex)
    } else {
      this.#events.splice(lastIndex + 1, 0, event)
      this.#updateSpanArea(lastIndex)
      this.#updateSpanArea(lastIndex + 1)
    }
  }

  #updateSpanArea(eventIndex: number): number | null {
    if (eventIndex < 0 || eventIndex >= this.#events.length) {
      return null
    }

    const startEvent = assertedAt(this.#events, eventIndex)

    if (eventIndex === this.#events.length - 1) {
      startEvent._area = undefined
      return null
    }

    const endEvent = assertedAt(this.#events, eventIndex + 1)
    const area = this.#spanAreaAt([startEvent, endEvent], endEvent.time)
    startEvent._area = area

    return area
  }

  #spanAreaAt(span: [AutomationEvent | null, AutomationEvent | null], time: SynthTime): number {
    const [start, end] = span

    if (!start && end) {
      throw new Error("can't evaluate area before start")
    }

    if (start && !end) {
      return (time.beats - start.time.beats) * start.value
    }

    if (!start || !end) {
      return 0
    }

    if (!end.ramp) {
      return (time.beats - start.time.beats) * start.value
    }

    return interpolationAreaTable[end.ramp](
      start.time.beats,
      start.value,
      time.beats,
      interpolationTable[end.ramp](start.time.beats, start.value, end.time.beats, end.value, time.beats),
    )
  }

  #eventIndexBeforeOrAt(time: SynthTime): number | null {
    this.#assertContext(time)

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

    assertUnreachable('AutomationCurve search failed')
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

  #assertNotEmpty() {
    if (this.#events.length === 0) {
      throw new Error(`empty ${AutomationCurve.name} cannot be evaluated`)
    }
  }

  #assertContext(time: SynthTime) {
    if (time.context !== this.#context) {
      throw new Error(`${AutomationCurve.name} received a SynthTime from different SynthContext`)
    }
  }
}

type Interpolation = (t0: number, v0: number, t1: number, v1: number, t: number) => number

const interpolationTable: Record<InterpolationMethod, Interpolation> = {
  linear: (t0, v0, t1, v1, t) => v0 + (v1 - v0) * ((t - t0) / (t1 - t0)),
  exponential: (t0, v0, t1, v1, t) => v0 * (v1 / v0) ** ((t - t0) / (t1 - t0)),
}

type Area = (t0: number, v0: number, t1: number, v1: number) => number

const interpolationAreaTable: Record<InterpolationMethod, Area> = {
  linear: (t0, v0, t1, v1) => ((v0 + v1) / 2) * (t1 - t0),
  exponential: (t0, v0, t1, v1) => ((t0 - t1) * (v0 - v1)) / Math.log(v1 / v0), // I'm not sure about that :)
}
