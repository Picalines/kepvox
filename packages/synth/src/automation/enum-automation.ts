import { assertDefined } from '@repo/common/assert'
import { SynthTime } from '#time'
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

    this.setValueAt(SynthTime.start, initialValue)
  }

  get timeRange() {
    return this.#timeline.timeRange
  }

  setValueAt(time: SynthTime, value: E) {
    this.#timeline.mergeEvent({ time, value })
  }

  holdValueAt(time: SynthTime) {
    const value = this.valueAt(time)
    this.#timeline.mergeEvent({ time, value })
    this.#timeline.cancelEventsAfter(time)
    return value
  }

  valueAt(time: SynthTime): E {
    const [beforeOrAt, after] = this.eventSpan(time)
    const value = beforeOrAt?.value ?? after?.value
    assertDefined(value)
    return value
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
}
