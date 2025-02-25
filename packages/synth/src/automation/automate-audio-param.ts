import type { ReadonlyAutomationCurve } from '#automation'
import type { SynthContext } from '#context'
import { INTERNAL_AUDIO_CONTEXT, INTERNAL_LOOK_AHEAD } from '#internal-symbols'
import { SynthTime } from '#time'
import type { UnitName, UnitValue } from '#units'
import type { Signal } from '#util/signal'

type Params<TUnit extends UnitName> = {
  context: SynthContext
  audioParam: AudioParam
  /**
   * Source of automation events
   */
  curve: ReadonlyAutomationCurve<TUnit>
  /**
   * Cancel AudioParam automation on the signal. Useful for dispose logic
   */
  until: Signal<null>
  /**
   * Change the curve value before sending it to AudioParam
   */
  map?: (curveValue: UnitValue<TUnit>, time: SynthTime) => number
}

/**
 * @internal
 * Schedules events from {@link AutomationCurve} to {@link AudioParam}
 */
export const automateAudioParam = <TUnit extends UnitName>(params: Params<TUnit>) => {
  const { context, audioParam, curve, until, map = x => x } = params

  const audioContext = context[INTERNAL_AUDIO_CONTEXT]

  const scheduleEvents = (start: SynthTime) => {
    const skippedSeconds = context.secondsPerNote.areaBefore(start)

    const now = audioContext.currentTime
    const ahead = now + context[INTERNAL_LOOK_AHEAD]

    const initialValue = map(curve.valueAt(start), start)
    audioParam.setValueAtTime(initialValue, now)
    audioParam.setValueAtTime(initialValue, ahead)

    for (const event of curve.eventsAfter(start)) {
      const time = ahead + (context.secondsPerNote.areaBefore(event.time) - skippedSeconds)

      if (event.ramp) {
        const rampFunc =
          event.ramp.method === 'linear' ? audioParam.linearRampToValueAtTime : audioParam.exponentialRampToValueAtTime

        rampFunc.call(audioParam, map(event.ramp.value, event.time), time - Number.EPSILON)
      }

      audioParam.setValueAtTime(map(event.value, event.time), time)
    }
  }

  const stopAudio = () => {
    audioParam.cancelScheduledValues(0)
    audioParam.value = map(curve.valueAt(SynthTime.start), SynthTime.start)
  }

  context.playing.watchUntil(until, ({ start }) => scheduleEvents(start))
  context.stopped.watchUntil(until, stopAudio)
}
