import type { SynthContext, SynthTimeLike } from '#context'
import { AutomationCurve } from './automation-curve'

export class AudioAutomationCurve extends AutomationCurve {
  readonly #context: SynthContext

  readonly #audioParam: AudioParam

  constructor(context: SynthContext, audioParam: AudioParam) {
    super(context)

    this.#context = context
    this.#audioParam = audioParam
  }

  schedule(start?: SynthTimeLike) {
    const startTime = this.#context.time(start ?? 0)
    const lastEvent = this.lastEvent(startTime)

    if (lastEvent) {
      this.#audioParam.setValueAtTime(this.getAt(startTime), startTime)
    }

    for (const event of this.nextEvents(startTime)) {
      const eventTime = this.#context.time(startTime + event.time)

      if (event.type === 'set') {
        this.#audioParam.setValueAtTime(event.value, eventTime)
      } else {
        const rampFunc =
          event.interpolation === 'linear'
            ? this.#audioParam.linearRampToValueAtTime
            : this.#audioParam.exponentialRampToValueAtTime

        rampFunc.call(this.#audioParam, event.value, eventTime)
      }
    }
  }
}
