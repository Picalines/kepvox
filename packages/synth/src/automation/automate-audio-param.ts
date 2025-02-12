import type { ReadonlyAutomationCurve } from '#automation'
import type { SynthContext } from '#context'
import { INTERNAL_AUDIO_CONTEXT, INTERNAL_LOOK_AHEAD } from '#internal-symbols'
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

  const audioContext = context[INTERNAL_AUDIO_CONTEXT]

  const scheduleEvents = (start: SynthTime) => {
    const skippedSeconds = context.secondsPerNote.areaBefore(start)

    const now = audioContext.currentTime
    const ahead = now + context[INTERNAL_LOOK_AHEAD]

    audioParam.setValueAtTime(curve.valueAt(start), now)

    for (const event of curve.eventsAfter(start)) {
      const time = ahead + (context.secondsPerNote.areaBefore(event.time) - skippedSeconds)

      if (event.ramp) {
        const rampFunc =
          event.ramp.method === 'linear' ? audioParam.linearRampToValueAtTime : audioParam.exponentialRampToValueAtTime

        rampFunc.call(audioParam, event.ramp.value, time - Number.EPSILON)
      }

      audioParam.setValueAtTime(event.value, time)
    }
  }

  const stopAudio = () => {
    audioParam.cancelScheduledValues(0)
    audioParam.value = curve.valueAt(SynthTime.start)
  }

  context.playing.watchUntil(until, ({ start }) => scheduleEvents(start))
  context.stopped.watchUntil(until, stopAudio)
}
