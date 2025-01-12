import type { Overlay } from '@repo/common/typing'
import type { SynthTime } from '#context'

export const automationKind: unique symbol = Symbol('Synth.automationKind')

export type DiscreteAutomation<T> = {
  readonly [automationKind]: 'discrete'
  /**
   * Cancels all scheduled events after the specified time.
   * Cancels all events, if the time point is already passed
   */
  cancelAfter(time: SynthTime): void
  /**
   * Schedules an event, when value will instantly jump to the specified value
   */
  setAt(time: SynthTime, value: T): void
}

export type InterpolationMethod = 'linear' | 'exponential'

export type InterpolatedAutomation = Overlay<
  DiscreteAutomation<number>,
  {
    readonly [automationKind]: 'interpolated'
    /**
     * Schedules an event, when the value will stop changing until next event
     */
    holdAt(time: SynthTime): void
    /**
     * Schedules an event, when the AudioParam will *stop the ramp* to the specified value.
     * To schedule a starting point of the ramp, call {@link setAt}
     */
    rampUntil(end: SynthTime, value: number, method?: InterpolationMethod): void
  }
>
