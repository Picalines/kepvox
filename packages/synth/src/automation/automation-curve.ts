import { assertDefined } from '@repo/common/assert'
import { Range } from '#math'
import { Time } from '#time'
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

    this.#timeline.changed.watch(event => this.#updateAreaAround(event))

    this.setValueAt(Time.start, initialValue)
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

  get changed() {
    return this.#timeline.changed
  }

  get cancelled() {
    return this.#timeline.cancelled
  }

  /**
   * Schedules an event where the curve would instantly jump to and stay at the
   * value. Keeps a ramp until the specified time
   */
  setValueAt(time: Time, value: UnitValue<TUnit>) {
    const rightValue = this.#processValue(value)
    const [beforeOrAtEvent, afterEvent] = this.#timeline.eventSpan(time)

    if (!beforeOrAtEvent || !afterEvent?.ramp) {
      this.#timeline.mergeEvent({ time, value: rightValue })
      return
    }

    if (time.isAfter(beforeOrAtEvent.time)) {
      const leftValue = this.valueAt(time)
      const ramp = { method: afterEvent.ramp.method, value: leftValue }
      this.#timeline.mergeEvent({ time, ramp, value: rightValue })
    }

    this.#timeline.mergeEvent({ ...afterEvent, ramp: undefined })
  }

  /**
   * Modifies the curve so that it stays at the specified value inside a given
   * range. Doesn't touch the values and ramps around the range
   */
  setValueAtUntil(at: Time, until: Time, value: UnitValue<TUnit>) {
    if (until.isBeforeOrAt(at)) {
      return
    }

    const middleValue = this.#processValue(value)
    const leftValue = this.valueAt(at)
    const rightValue = this.valueAt(until)
    const leftCutEvent = this.#timeline.eventAfterOrAt(at)

    this.#timeline.mergeEvent({
      time: at,
      value: middleValue,
      ramp: leftCutEvent?.ramp ? { method: leftCutEvent.ramp.method, value: leftValue } : undefined,
    })

    this.#timeline.mergeEvent({ time: until, value: rightValue })

    this.#timeline.cancelEventsAfterUntil(at, until)
  }

  /**
   * Creates a ramp between two specified moments that interpolates the value
   * from the starting moment to the specified value on the ending moment
   *
   * This method is exclusive, so the curve will not continue to have the value
   * after the ending moment
   */
  rampValueAtUntil(start: Time, end: Time, value: UnitValue<TUnit>, method: InterpolationMethod = 'linear') {
    if (start.isAfterOrAt(end)) {
      return
    }

    const rampValue = this.#processValue(value)
    const leftValue = this.valueAt(start)
    const rightValue = this.valueAt(end)
    const leftCutEvent = this.#timeline.eventAfterOrAt(start)

    this.#timeline.mergeEvent({
      time: start,
      value: leftValue,
      ramp: leftCutEvent?.ramp ? { method: leftCutEvent.ramp.method, value: leftValue } : undefined,
    })

    this.#timeline.mergeEvent({ time: end, value: rightValue, ramp: { method, value: rampValue } })

    this.#timeline.cancelEventsAfterUntil(start, end)
  }

  rampValueAtTo(start: Time, end: Time, value: UnitValue<TUnit>, method?: InterpolationMethod) {
    if (start.isAfter(end)) {
      return
    }

    this.rampValueAtUntil(start, end, value, method)
    this.setValueAt(end, value)
  }

  /**
   * @returns curve value at a given time
   */
  valueAt(time: Time): UnitValue<TUnit> {
    const [before, after] = this.#timeline.eventSpan(time)

    if (!before || !after) {
      const value = before?.value ?? after?.value
      assertDefined(value)
      return value
    }

    if (!after.ramp) {
      return before.value
    }

    return interpolationTable[after.ramp.method](
      before.time.notes,
      before.value,
      after.time.notes,
      after.ramp.value,
      time.notes,
    ) as UnitValue<TUnit>
  }

  areaBefore(time: Time): number {
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

  eventAt(time: Time) {
    return this.#timeline.eventAt(time)
  }

  eventBefore(time: Time) {
    return this.#timeline.eventBefore(time)
  }

  eventBeforeOrAt(time: Time) {
    return this.#timeline.eventBeforeOrAt(time)
  }

  eventAfter(time: Time) {
    return this.#timeline.eventAfter(time)
  }

  eventAfterOrAt(time: Time) {
    return this.#timeline.eventAfterOrAt(time)
  }

  eventsAfter(time: Time) {
    return this.#timeline.eventsAfter(time)
  }

  eventsBefore(time: Time) {
    return this.#timeline.eventsBefore(time)
  }

  eventSpan(time: Time) {
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

  #spanAreaAt(span: [AutomationCurveEvent<TUnit> | null, AutomationCurveEvent<TUnit> | null], time: Time): number {
    const [start, end] = span

    if (!start && end) {
      throw new Error(`${AutomationCurve.name} can't evaluate area before start`)
    }

    if (start && !end) {
      return (time.notes - start.time.notes) * start.value
    }

    if (!start || !end) {
      return 0
    }

    if (!end.ramp) {
      return (time.notes - start.time.notes) * start.value
    }

    return interpolationAreaTable[end.ramp.method](
      start.time.notes,
      start.value,
      time.notes,
      interpolationTable[end.ramp.method](start.time.notes, start.value, end.time.notes, end.ramp.value, time.notes),
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
