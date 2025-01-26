import type { SynthContext, SynthTime } from '#context'
import { AutomationCurve, type AutomationCurveOpts } from './automation-curve'

export type AudioAutomationCurveOpts = AutomationCurveOpts

/**
 * @internal
 */
export class AudioAutomationCurve extends AutomationCurve {
  readonly #context: SynthContext

  readonly #audioParam: AudioParam

  constructor(context: SynthContext, audioParam: AudioParam, opts?: AudioAutomationCurveOpts) {
    super(context, opts)

    this.#context = context
    this.#audioParam = audioParam

    this.#context.on('play', start => this.#schedule(start), { signal: context.disposed })

    this.#context.on(
      'stop',
      () => {
        this.#audioParam.cancelScheduledValues(0)
        this.#audioParam.value = this.valueAt(this.#context.firstBeat)
      },
      { signal: context.disposed },
    )
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
