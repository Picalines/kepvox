import { assertDefined } from '@repo/common/assert'
import { Range } from '#math'
import { SynthTime } from '#time'
import { Unit, type UnitName, type UnitValue } from '#units'
import { EventTimeline } from './event-timeline'
import type { AutomationCurveEvent, InterpolationMethod, ReadonlyAutomationCurve } from './readonly-automation-curve'

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
  readonly #timeline = new EventTimeline<AutomationCurveEvent<TUnit>>()

  /**
   * Area of a segment between this event and the next one.
   * undefined if cant be determined
   */
  readonly #spanAreas = new WeakMap<AutomationCurveEvent<TUnit>, number>()

  constructor(opts: AutomationCurveOpts<TUnit>) {
    const { unit, initialValue, valueRange = Range.any } = opts
    const unitRange = Unit[unit].range

    const commonRange = unitRange.intersection(valueRange)
    if (!commonRange) {
      throw new Error(`${AutomationCurve.name} of ${unit} (${unitRange}) can't handle the ${valueRange} value range`)
    }

    this.#unit = unit
    this.#valueRange = commonRange

    this.#timeline.changed.watch(({ event }) => this.#updateAreaAround(event))

    this.setValueAt(SynthTime.start, initialValue)
  }

  get unit(): TUnit {
    return this.#unit
  }

  get timeRange() {
    return this.#timeline.timeRange
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
    this.#timeline.mergeEvent({ time, value: this.#processValue(value) })
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

    this.#timeline.mergeEvent({ time: end, ramp: { value: leftValue, method }, value: rightValue })
  }

  /**
   * Cancels events after the specified time and inserts an
   * event that will hold the old value at the time
   *
   * @returns the value
   */
  holdValueAt(time: SynthTime): UnitValue<TUnit> {
    const value = this.valueAt(time)
    this.#timeline.mergeEvent({ time, value })
    this.#timeline.cancelEventsAfter(time)
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

  areaBefore(time: SynthTime): number {
    const lastEvent = this.eventBeforeOrAt(time)
    if (!lastEvent) {
      throw new Error("can't evaluate area before start")
    }

    const beforeArea = this.eventsBefore(lastEvent.time).reduce(
      (sum, event) => sum + (this.#spanAreas.get(event) ?? 0),
      0,
    )

    return beforeArea + this.#spanAreaAt(this.eventSpan(time), time)
  }

  eventAt(time: SynthTime) {
    return this.#timeline.eventAt(time)
  }

  eventBefore(time: SynthTime) {
    return this.#timeline.eventBefore(time)
  }

  eventBeforeOrAt(time: SynthTime) {
    return this.#timeline.eventBeforeOrAt(time)
  }

  eventAfter(time: SynthTime) {
    return this.#timeline.eventAfter(time)
  }

  eventAfterOrAt(time: SynthTime) {
    return this.#timeline.eventAfterOrAt(time)
  }

  eventsAfter(time: SynthTime) {
    return this.#timeline.eventsAfter(time)
  }

  eventsBefore(time: SynthTime) {
    return this.#timeline.eventsBefore(time)
  }

  eventsInRange(start: SynthTime, end: SynthTime) {
    return this.#timeline.eventsInRange(start, end)
  }

  eventSpan(time: SynthTime) {
    return this.#timeline.eventSpan(time)
  }

  #processValue(value: UnitValue<TUnit>) {
    return this.#valueRange.clamp(value) as UnitValue<TUnit>
  }

  #updateAreaAround(event: AutomationCurveEvent<TUnit>) {
    const prevEvent = this.eventBefore(event.time)
    const nextEvent = this.eventAfter(event.time)

    if (prevEvent) {
      this.#spanAreas.set(prevEvent, this.#spanAreaAt([prevEvent, event], event.time))
    }

    if (nextEvent) {
      this.#spanAreas.set(event, this.#spanAreaAt([event, nextEvent], nextEvent.time))
    } else {
      this.#spanAreas.delete(event)
    }
  }

  #spanAreaAt(span: [AutomationCurveEvent<TUnit> | null, AutomationCurveEvent<TUnit> | null], time: SynthTime): number {
    const [start, end] = span

    if (!start && end) {
      throw new Error(`${AutomationCurve.name} can't evaluate area before start`)
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
