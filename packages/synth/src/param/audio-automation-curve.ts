import { type SynthContext, SynthTime } from '#context'
import type { UnitName } from '#units'
import { AutomationCurve, type AutomationCurveOpts } from './automation-curve'

export type AudioAutomationCurveOpts<TUnit extends UnitName> = AutomationCurveOpts<TUnit>

/**
 * @internal
 */
export class AudioAutomationCurve<TUnit extends UnitName> extends AutomationCurve<TUnit> {
  readonly #context: SynthContext

  readonly #audioParam: AudioParam

  constructor(context: SynthContext, audioParam: AudioParam, opts: AudioAutomationCurveOpts<TUnit>) {
    super(context, opts)

    this.#context = context
    this.#audioParam = audioParam

    this.#context.on('play', start => this.#schedule(start))

    this.#context.on('stop', () => {
      this.#audioParam.cancelScheduledValues(0)
      this.#audioParam.value = this.valueAt(SynthTime.start)
    })
  }

  #schedule(start: SynthTime) {
    const lastEvent = this.eventBeforeOrAt(start)
    if (lastEvent) {
      this.#audioParam.setValueAtTime(this.valueAt(start), 0)
    }

    const scheduleStart = this.#context.scheduleTime

    for (const event of this.eventsAfter(start)) {
      const scheduleTime = scheduleStart + this.#context.secondsPerBeat.areaBefore(event.time)

      const scheduleFunc = event.ramp
        ? event.ramp === 'linear'
          ? this.#audioParam.linearRampToValueAtTime
          : this.#audioParam.exponentialRampToValueAtTime
        : this.#audioParam.setValueAtTime

      scheduleFunc.call(this.#audioParam, event.value, scheduleTime)
    }
  }
}
