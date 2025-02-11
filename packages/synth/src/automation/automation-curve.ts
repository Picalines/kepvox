import { isNonEmpty } from '@repo/common/array'
import { assertDefined, assertUnreachable, assertedAt } from '@repo/common/assert'
import { Range } from '#math'
import { SynthTime } from '#time'
import { Unit, type UnitName, type UnitValue } from '#units'
import type {
  AutomationEvent,
  RampDirection,
  InterpolationMethod,
  ReadonlyAutomationCurve,
} from './readonly-automation-curve'

export type AutomationCurveOpts<TUnit extends UnitName> = {
  unit: TUnit
  initialValue: UnitValue<TUnit>
  valueRange?: Range
}

export class AutomationCurve<TUnit extends UnitName> implements ReadonlyAutomationCurve<TUnit> {
  readonly #unit: TUnit
  readonly #valueRange: Range

  /**
   * NOTE: has at least one element after construction
   */
  readonly #events: AutomationEvent<TUnit>[] = []

  /**
   * Area of a segment between this event and the next one.
   * undefined if cant be determined
   */
  readonly #eventAreas = new WeakMap<AutomationEvent<TUnit>, number>()

  constructor(opts: AutomationCurveOpts<TUnit>) {
    const { unit, initialValue, valueRange = Range.any } = opts
    const unitRange = Unit[unit].range

    const commonRange = unitRange.intersection(valueRange)
    if (!commonRange) {
      throw new Error(`${AutomationCurve.name} of ${unit} (${unitRange}) can't handle the ${valueRange} value range`)
    }

    this.#unit = unit
    this.#valueRange = commonRange

    this.setValueAt(SynthTime.start, initialValue)
  }

  get unit(): TUnit {
    return this.#unit
  }

  get timeRange(): [start: SynthTime, end: SynthTime] {
    const start = assertedAt(this.#events, 0)
    const end = assertedAt(this.#events, -1)
    return [start.time, end.time]
  }

  /**
   * @returns a range of values that the curve can accept.
   * Think "physically possible" range, not the actual values range
   */
  get valueRange(): Range {
    return this.#valueRange
  }

  /**
   * Schedules an event, when value will instantly jump to the specified value
   *
   * Second {@link setValueAt} call overrides the first one. Doesn't cancel the {@link rampValueUntil}
   */
  setValueAt(time: SynthTime, value: UnitValue<TUnit>) {
    this.#mergeEvent({ time, value: this.#processValue(value) })
  }

  /**
   * Schedules an event, when the value will *stop ramping* to the specified value
   *
   * The curve will approach to the value up until the time, but exactly at that point
   * some other event might override the value. If there's no event at the time the value
   * will settle at the ramp value
   *
   * Second {@link rampValueUntil} overrides the ramp method and value. Doesn't cancel the {@link setValueAt}
   */
  rampValueUntil(end: SynthTime, value: UnitValue<TUnit>, method: InterpolationMethod = 'linear') {
    const leftValue = this.#processValue(value)

    const existingEvent = this.eventAt(end)
    const rightValue = existingEvent?.value ?? leftValue

    this.#mergeEvent({ time: end, ramp: { value: leftValue, method }, value: rightValue })
  }

  /**
   * Cancels events after the specified time and inserts an
   * event that will hold the old value at the time
   *
   * @returns the value
   */
  holdValueAt(time: SynthTime): UnitValue<TUnit> {
    const value = this.valueAt(time)
    this.#mergeEvent({ time, value })

    const cutIndex = this.#eventIndexAfter(time)
    if (cutIndex !== null) {
      this.#events.splice(cutIndex)
      this.#updateSpanArea(this.#events.length - 1)
    }

    return value
  }

  /**
   * @returns curve value at a given time
   */
  valueAt(time: SynthTime): UnitValue<TUnit> {
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

    return interpolationTable[after.ramp.method](
      before.time.toNotes(),
      before.value,
      after.time.toNotes(),
      after.ramp.value,
      time.toNotes(),
    ) as UnitValue<TUnit>
  }

  rampDirectionAt(time: SynthTime): RampDirection {
    const [before, after] = this.eventSpan(time)

    if (!before || !after || !after.ramp) {
      return 'none'
    }

    if (after.ramp.value === before.value) {
      return 'none'
    }

    return after.ramp.value > before.value ? 'increasing' : 'decreasing'
  }

  areaBefore(time: SynthTime): number {
    const lastEvent = this.eventBeforeOrAt(time)
    if (!lastEvent) {
      throw new Error("can't evaluate area before start")
    }

    const beforeArea = this.eventsBefore(lastEvent.time).reduce(
      (sum, event, index) => sum + (this.#eventAreas.get(event) ?? this.#updateSpanArea(index) ?? 0),
      0,
    )

    return beforeArea + this.#spanAreaAt(this.eventSpan(time), time)
  }

  eventAt(time: SynthTime): AutomationEvent<TUnit> | null {
    const event = this.#events[this.#eventIndexAfterOrAt(time) ?? -1] ?? null
    return event?.time.equals(time) ? event : null
  }

  eventBefore(time: SynthTime): AutomationEvent<TUnit> | null {
    return this.#events[this.#eventIndexBefore(time) ?? -1] ?? null
  }

  eventBeforeOrAt(time: SynthTime): AutomationEvent<TUnit> | null {
    return this.#events[this.#eventIndexBeforeOrAt(time) ?? -1] ?? null
  }

  eventAfter(time: SynthTime): AutomationEvent<TUnit> | null {
    return this.#events[this.#eventIndexAfter(time) ?? -1] ?? null
  }

  eventAfterOrAt(time: SynthTime): AutomationEvent<TUnit> | null {
    return this.#events[this.#eventIndexAfterOrAt(time) ?? -1] ?? null
  }

  *eventsAfter(time: SynthTime): Generator<AutomationEvent<TUnit>, void, undefined> {
    const startIndex = this.#eventIndexAfter(time) ?? this.#events.length
    for (let i = startIndex; i < this.#events.length; i++) {
      yield assertedAt(this.#events, i)
    }
  }

  *eventsBefore(time: SynthTime): Generator<AutomationEvent<TUnit>, void, undefined> {
    const stopIndex = this.#eventIndexBefore(time) ?? -1
    for (let i = 0; i <= stopIndex; i++) {
      yield assertedAt(this.#events, i)
    }
  }

  *eventsInRange(start: SynthTime, end: SynthTime): Generator<AutomationEvent<TUnit>, void, undefined> {
    const startIndex = this.#eventIndexAfterOrAt(start) ?? 0
    const endIndex = this.#eventIndexBeforeOrAt(end) ?? this.#events.length - 1
    for (let i = startIndex; i <= endIndex; i++) {
      yield assertedAt(this.#events, i)
    }
  }

  eventSpan(time: SynthTime): [AutomationEvent<TUnit> | null, AutomationEvent<TUnit> | null] {
    return [this.eventBeforeOrAt(time), this.eventAfter(time)]
  }

  #processValue(value: UnitValue<TUnit>) {
    return this.#valueRange.clamp(value) as UnitValue<TUnit>
  }

  #mergeEvent(event: AutomationEvent<TUnit>) {
    const lastEventIndex = this.#eventIndexBeforeOrAt(event.time)

    const lastEvent = lastEventIndex !== null ? assertedAt(this.#events, lastEventIndex) : null

    if (lastEventIndex === null) {
      this.#events.push(event)
      this.#updateSpanArea(this.#events.length - 2)
      this.#updateSpanArea(this.#events.length - 1)
    } else if (lastEvent?.time.equals(event.time)) {
      this.#events.splice(lastEventIndex, 1, { ...lastEvent, ...event })
      this.#updateSpanArea(lastEventIndex - 1)
      this.#updateSpanArea(lastEventIndex)
    } else {
      this.#events.splice(lastEventIndex + 1, 0, event)
      this.#updateSpanArea(lastEventIndex)
      this.#updateSpanArea(lastEventIndex + 1)
    }
  }

  #updateSpanArea(eventIndex: number): number | null {
    if (eventIndex < 0 || eventIndex >= this.#events.length) {
      return null
    }

    const startEvent = assertedAt(this.#events, eventIndex)

    if (eventIndex === this.#events.length - 1) {
      this.#eventAreas.delete(startEvent)
      return null
    }

    const endEvent = assertedAt(this.#events, eventIndex + 1)
    const area = this.#spanAreaAt([startEvent, endEvent], endEvent.time)
    this.#eventAreas.set(startEvent, area)

    return area
  }

  #spanAreaAt(span: [AutomationEvent<TUnit> | null, AutomationEvent<TUnit> | null], time: SynthTime): number {
    const [start, end] = span

    if (!start && end) {
      throw new Error("can't evaluate area before start")
    }

    if (start && !end) {
      return (time.toNotes() - start.time.toNotes()) * start.value
    }

    if (!start || !end) {
      return 0
    }

    if (!end.ramp) {
      return (time.toNotes() - start.time.toNotes()) * start.value
    }

    return interpolationAreaTable[end.ramp.method](
      start.time.toNotes(),
      start.value,
      time.toNotes(),
      interpolationTable[end.ramp.method](
        start.time.toNotes(),
        start.value,
        end.time.toNotes(),
        end.ramp.value,
        time.toNotes(),
      ),
    )
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
