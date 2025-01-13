import { Range } from '@repo/common/math'
import type { SynthContext, SynthTime, SynthTimeLike } from '#context'
import { UNIT_RANGES, type UnitName } from '#units'
import { AutomationCurve, type CurveSchedulable } from './automation-curve'
import { InterpolatedSynthParam, type InterpolationMethod, synthParamType } from './synth-param'

export namespace AudioSynthParam {
  export type Opts = {
    context: SynthContext
    unit: UnitName
    initialValue: number
    range?: Range
  }
}

const hasAssociatedParamSymbol = Symbol('associatedSynthAudioParam')

export class AudioSynthParam extends InterpolatedSynthParam {
  readonly [synthParamType] = 'audio'

  readonly unit: UnitName
  readonly range: Range

  readonly #context: SynthContext
  readonly #audioParam: AudioParam
  readonly #curve: AutomationCurve
  readonly #paramAutomation: AudioParamAutomation

  constructor(audioParam: AudioParam, opts: AudioSynthParam.Opts) {
    const { context, unit, initialValue, range: rangeParam = Range.any } = opts

    const unitRange = UNIT_RANGES[unit]
    const nativeRange = new Range(audioParam.minValue, audioParam.maxValue)
    const range = unitRange.intersection(nativeRange)?.intersection(rangeParam)

    if (!range) {
      throw new Error('the range parameter and AudioNode range have no point in common')
    }

    const safeInitialValue = range.clamp(initialValue)

    if (hasAssociatedParamSymbol in audioParam) {
      throw new Error('the AudioParam already has an AudioSynthParam associated with it')
    }

    super()

    // @ts-expect-error: adding a custom symbol to prevent "races"
    // between different synth parameters controlling the same AudioParam
    audioParam[hasAssociatedParamSymbol] = true

    this.unit = unit
    this.range = range

    this.#context = context
    this.#audioParam = audioParam
    this.#curve = new AutomationCurve(context)
    this.#paramAutomation = new AudioParamAutomation(context, this.#audioParam)

    this.#audioParam.cancelScheduledValues(this.#context.currentTime)
    this.#audioParam.setValueAtTime(safeInitialValue, this.#context.currentTime)
    this.#curve.setAt(this.#context.currentTime, safeInitialValue)
  }

  setImmediate(value: number) {
    this.#audioParam.setValueAtTime(this.range.clamp(value), this.#context.currentTime)
  }

  getImmediate() {
    return this.#audioParam.value
  }

  getAt(time: SynthTimeLike) {
    return this.#curve.getAt(time)
  }

  setAt(time: SynthTimeLike, value: number) {
    this.#curve.setAt(time, this.range.clamp(value))
    this.#curve.schedule(this.#paramAutomation)
  }

  cancelAfter(time: SynthTime) {
    const cancelTime = this.#context.time(time)
    this.#curve.cancelAfter(cancelTime)
    this.#audioParam.cancelScheduledValues(cancelTime)
    this.#curve.schedule(this.#paramAutomation)
  }

  holdAt(time: SynthTime) {
    this.#curve.holdAt(time)
    this.#curve.schedule(this.#paramAutomation)
  }

  rampUntil(end: SynthTimeLike, value: number, method: InterpolationMethod = 'linear') {
    this.#curve.rampUntil(end, this.range.clamp(value), method)
    this.#curve.schedule(this.#paramAutomation)
  }
}

class AudioParamAutomation implements CurveSchedulable {
  constructor(
    readonly context: SynthContext,
    readonly audioParam: AudioParam,
  ) {}

  setAt(time: SynthTimeLike, value: number) {
    this.audioParam.setValueAtTime(value, this.context.time(time))
  }

  rampUntil(end: SynthTimeLike, value: number, method: InterpolationMethod = 'linear') {
    const rampFunc =
      method === 'linear' ? this.audioParam.linearRampToValueAtTime : this.audioParam.exponentialRampToValueAtTime

    rampFunc.call(this.audioParam, value, this.context.time(end))
  }
}
