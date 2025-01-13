import type { SynthTimeLike } from '#context'

export const synthParamType: unique symbol = Symbol('SynthParam.type')

export abstract class SynthParam<T> {
  abstract readonly [synthParamType]: string

  abstract getImmediate(): T

  abstract setImmediate(value: T): void
}

export abstract class DiscreteSynthParam<T> extends SynthParam<T> {
  /**
   * Gets value of the param at a given time
   */
  abstract getAt(time: SynthTimeLike): T

  /**
   * Schedules an event, when value will instantly jump to the specified value
   */
  abstract setAt(time: SynthTimeLike, value: T): void

  /**
   * Cancels all scheduled events after the specified time.
   * Cancels all events, if the time point is already passed
   */
  abstract cancelAfter(time: SynthTimeLike): void
}

export type InterpolationMethod = 'linear' | 'exponential'

export abstract class InterpolatedSynthParam extends DiscreteSynthParam<number> {
  /**
   * Schedules an event, when the value will stop changing until next event
   */
  abstract holdAt(time: SynthTimeLike): void

  /**
   * Schedules an event, when the AudioParam will *stop the ramp* to the specified value.
   * To schedule a starting point of the ramp, call {@link setAt}
   */
  abstract rampUntil(end: SynthTimeLike, value: number, method?: InterpolationMethod): void
}
