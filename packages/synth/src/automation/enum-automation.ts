import { assertDefined } from '@repo/common/assert'
import { Time } from '#time'
import { EventTimeline } from './event-timeline'
import type { EnumAutomationEvent, ReadonlyEnumAutomation } from './readonly-enum-automation'

export type EnumAutomationOpts<E extends string> = {
  values: readonly E[]
  initialValue: NoInfer<E>
}

export class EnumAutomation<E extends string> implements ReadonlyEnumAutomation<E> {
  readonly values: readonly E[]

  readonly #timeline = new EventTimeline<EnumAutomationEvent<E>>()

  constructor(opts: EnumAutomationOpts<E>) {
    const { values, initialValue } = opts

    this.values = [...values]

    this.setValueAt(Time.start, initialValue)
  }

  get timeRange() {
    return this.#timeline.timeRange
  }

  get changed() {
    return this.#timeline.changed
  }

  get cancelled() {
    return this.#timeline.cancelled
  }

  setValueAt(time: Time, value: E) {
    this.#timeline.mergeEvent({ time, value })
  }

  holdValueAt(time: Time) {
    const value = this.valueAt(time)
    this.#timeline.mergeEvent({ time, value })
    this.#timeline.cancelEventsAfter(time)
    return value
  }

  valueAt(time: Time): E {
    const [beforeOrAt, after] = this.eventSpan(time)
    const value = beforeOrAt?.value ?? after?.value
    assertDefined(value)
    return value
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

  eventsInRange(start: Time, end: Time) {
    return this.#timeline.eventsInRange(start, end)
  }

  eventSpan(time: Time) {
    return this.#timeline.eventSpan(time)
  }
}
