import { isNonEmpty, isTuple } from '@repo/common/array'
import { assertDefined, assertUnreachable } from '@repo/common/assert'
import type { OmitExisting } from '@repo/common/typing'
import type { SynthContext, SynthTime, SynthTimeLike } from '#context'
import type { InterpolatedSynthParam, InterpolationMethod, synthParamType } from './synth-param'

type AutomationEventPayload = {
  set: { value: number }
  endRamp: { value: number; interpolation: InterpolationMethod }
}

type AutomationEventType = keyof AutomationEventPayload

type AutomationEvent<T extends AutomationEventType = AutomationEventType> = T extends T
  ? {
      type: T
      timeLike: SynthTimeLike
      time: SynthTime
    } & AutomationEventPayload[T]
  : never

export type CurveSchedulable = Pick<InterpolatedSynthParam, 'setAt' | 'rampUntil'>

export class AutomationCurve
  implements OmitExisting<InterpolatedSynthParam, typeof synthParamType | 'getImmediate' | 'setImmediate'>
{
  readonly #context: SynthContext

  readonly #events: AutomationEvent[] = []

  constructor(context: SynthContext) {
    this.#context = context
  }

  cancelAfter(time: SynthTimeLike) {
    const cancelTime = this.#context.time(time)
    const cutIndex = this.#lastEventIndex(cancelTime)
    if (cutIndex !== null) {
      this.#events.splice(cutIndex + 1)
    }
  }

  setAt(time: SynthTimeLike, value: number) {
    this.#addEvent({ type: 'set', timeLike: time, value })
  }

  rampUntil(end: SynthTimeLike, value: number, method: InterpolationMethod = 'linear') {
    this.#addEvent({ type: 'endRamp', timeLike: end, value, interpolation: method })
  }

  holdAt(time: SynthTimeLike) {
    const holdTime = this.#context.time(time)
    const value = this.getAt(holdTime)
    this.cancelAfter(holdTime)
    this.setAt(holdTime, value)
  }

  schedule(automatable: CurveSchedulable, start?: SynthTimeLike) {
    const startTime = this.#context.time(start ?? 0)
    const previousIndex = this.#lastEventIndex(startTime) ?? -1

    if (previousIndex >= 0) {
      automatable.setAt(startTime, this.getAt(startTime))
    }

    for (let i = previousIndex + 1; i < this.#events.length; i++) {
      const event = this.#events[i]
      assertDefined(event)

      const eventTime = this.#context.time(startTime + event.time)

      if (event.type === 'set') {
        automatable.setAt(eventTime, event.value)
      } else {
        automatable.rampUntil(eventTime, event.value, event.interpolation)
      }
    }
  }

  getAt(time: SynthTimeLike): number {
    const evalTime = this.#context.time(time)

    const [before, after] = this.#eventRange(evalTime)

    if (!before && !after) {
      throw new Error(`empty ${AutomationCurve.name} cannot be evaluated`)
    }

    if (!before && after) {
      return after.value
    }

    if (before && !after) {
      return before.value
    }

    assertDefined(before)
    assertDefined(after)

    if (after.type === 'set') {
      return before.value
    }

    return interpolationTable[after.interpolation](before.time, before.value, after.time, after.value, evalTime)
  }

  #addEvent(event: OmitExisting<AutomationEvent, 'time'>) {
    const time = this.#context.time(event.timeLike)
    const eventToAdd = { ...event, time }

    const lastEventIndex = this.#lastEventIndex(time)

    if (lastEventIndex === null) {
      this.#events.push(eventToAdd)
    } else if (this.#events[lastEventIndex]?.time === time) {
      this.#events.splice(lastEventIndex, 1, eventToAdd)
    } else {
      this.#events.splice(lastEventIndex + 1, 0, eventToAdd)
    }
  }

  #eventRange(time: SynthTime): [AutomationEvent | null, AutomationEvent | null] {
    const events = this.#events

    const previousIndex = this.#lastEventIndex(time)
    if (previousIndex !== null) {
      return [events[previousIndex] as AutomationEvent, events[previousIndex + 1] ?? null]
    }

    if (isTuple(events, 1)) {
      const [event] = events
      return time >= event.time ? [event, null] : [null, event]
    }

    return [null, null]
  }

  #lastEventIndex(time: SynthTime, eventOffset?: SynthTime): number | null {
    const events = this.#events
    if (!isNonEmpty(events)) {
      return null
    }

    const offsetTime = eventOffset ?? this.#context.time(0)

    const firstEvent = events[0]
    if (time < firstEvent.time + offsetTime) {
      return null
    }

    const lastEvent = events[events.length - 1]
    if (lastEvent && time >= lastEvent.time) {
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

      const middleTime = middleEvent.time + offsetTime
      const nextTime = nextEvent.time + offsetTime

      if (time >= middleTime && time < nextTime) {
        return middle
      }

      if (time > middleTime) {
        start = middle + 1
      } else {
        end = middle - 1
      }
    }

    assertUnreachable('AutomationCurve search failed')
  }
}

type Interpolation = (t0: number, v0: number, t1: number, v1: number, t: number) => number

const interpolationTable: Record<InterpolationMethod, Interpolation> = {
  linear: (t0, v0, t1, v1, t) => v0 + (v1 - v0) * ((t - t0) / (t1 - t0)),
  exponential: (t0, v0, t1, v1, t) => v0 * (v1 / v0) ** ((t - t0) / (t1 - t0)),
}
