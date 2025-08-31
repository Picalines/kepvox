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

  setValueAtUntil(at: Time, until: Time, value: E) {
    if (until.isBeforeOrAt(at)) {
      return
    }

    const rightValue = this.valueAt(until)

    this.#timeline.mergeEvent({ time: at, value })
    this.#timeline.mergeEvent({ time: until, value: rightValue })
    this.#timeline.cancelEventsAfterUntil(at, until)
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

  eventsAfterOrAt(time: Time) {
    return this.#timeline.eventsAfterOrAt(time)
  }

  eventsBefore(time: Time) {
    return this.#timeline.eventsBefore(time)
  }

  eventsBeforeOrAt(time: Time) {
    return this.#timeline.eventsBeforeOrAt(time)
  }

  eventsAfterUntil(after: Time, until: Time) {
    return this.#timeline.eventsAfterUntil(after, until)
  }

  eventSpan(time: Time) {
    return this.#timeline.eventSpan(time)
  }
}
