import type { ReadonlyAutomationCurve } from '#automation'
import type { SynthContext } from '#context'
import { SynthTime } from '#time'
import type { UnitName } from '#units'
import type { Signal } from '#util/signal'

type Params = {
  context: SynthContext
  audioParam: AudioParam
  /**
   * Source of automation events
   */
  curve: ReadonlyAutomationCurve<UnitName>
  /**
   * Cancel AudioParam automation on the signal. Useful for dispose logic
   */
  until: Signal<null>
}

/**
 * @internal
 * Schedules events from {@link AutomationCurve} to {@link AudioParam}
 */
export const automateAudioParam = (params: Params) => {
  const { context, audioParam, curve, until } = params

  const scheduleEvents = (start: SynthTime) => {
    const scheduleStart = context.scheduleTime
    const skippedSeconds = context.secondsPerNote.areaBefore(start)

    audioParam.value = curve.valueAt(start)

    for (const event of curve.eventsAfter(start)) {
      const scheduleTime = scheduleStart + (context.secondsPerNote.areaBefore(event.time) - skippedSeconds)

      if (event.ramp) {
        const rampFunc =
          event.ramp.method === 'linear' ? audioParam.linearRampToValueAtTime : audioParam.exponentialRampToValueAtTime

        rampFunc.call(audioParam, event.ramp.value, scheduleTime - Number.EPSILON)
      }

      audioParam.setValueAtTime(event.value, scheduleTime)
    }
  }

  const stopAudio = () => {
    audioParam.cancelScheduledValues(0)
    audioParam.value = curve.valueAt(SynthTime.start)
  }

  context.playing.watchUntil(until, ({ start }) => scheduleEvents(start))
  context.stopped.watchUntil(until, stopAudio)
}
