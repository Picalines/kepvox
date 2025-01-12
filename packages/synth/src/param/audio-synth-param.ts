import { Range } from '@repo/common/math'
import type { SynthContext, SynthTime, SynthTimeLike } from '#context'
import { UNIT_RANGES, type UnitName } from '#units'
import { type InterpolatedAutomation, type InterpolationMethod, automationKind } from './automation'
import { type SynthParam, synthParamType } from './synth-param'

export namespace AudioSynthParam {
  export type Opts = {
    context: SynthContext
    unit: UnitName
    initialValue: number
    range?: Range
  }
}

const hasAssociatedParamSymbol = Symbol('associatedSynthAudioParam')

export class AudioSynthParam implements SynthParam<number>, InterpolatedAutomation {
  readonly [synthParamType] = 'audio'
  readonly [automationKind] = 'interpolated'

  readonly unit: UnitName
  readonly range: Range

  readonly #context: SynthContext
  readonly #audioParam: AudioParam

  constructor(audioParam: AudioParam, opts: AudioSynthParam.Opts) {
    const { context, unit, initialValue, range: rangeParam = Range.any } = opts

    const unitRange = UNIT_RANGES[unit]
    const nativeRange = new Range(audioParam.minValue, audioParam.maxValue)
    const range = unitRange.intersection(nativeRange)?.intersection(rangeParam)

    if (!range) {
      throw new Error('the range parameter and AudioNode range have no point in common')
    }

    if (!range.includes(initialValue)) {
      throw new Error('the initialValue parameter is not in range')
    }

    if (hasAssociatedParamSymbol in audioParam) {
      throw new Error('the AudioParam already has an AudioSynthParam associated with it')
    }

    // @ts-expect-error: adding a custom symbol to prevent "races"
    // between different synth parameters controlling the same AudioParam
    audioParam[hasAssociatedParamSymbol] = true

    this.unit = unit
    this.range = range

    this.#context = context
    this.#audioParam = audioParam

    this.#audioParam.cancelScheduledValues(this.#context.currentTime)
    this.#audioParam.setValueAtTime(initialValue, this.#context.currentTime)
  }

  setImmediate(value: number) {
    this.#audioParam.setValueAtTime(this.range.clamp(value), this.#context.currentTime)
  }

  getImmediate() {
    return this.#audioParam.value
  }

  setAt(time: SynthTimeLike, value: number) {
    const setTime = this.#context.time(time)
    if (setTime >= this.#context.currentTime) {
      this.#audioParam.setValueAtTime(this.range.clamp(value), setTime)
    }
  }

  cancelAfter(time: SynthTime) {
    this.#audioParam.cancelScheduledValues(this.#context.time(time))
  }

  holdAt(time: SynthTime) {
    // TODO(#8): cancelAndHoldAtTime not implemented in some browsers
    this.#audioParam.cancelAndHoldAtTime(this.#context.time(time))
  }

  rampUntil(end: SynthTimeLike, value: number, method: InterpolationMethod = 'linear') {
    const rampFunc =
      method === 'linear' ? this.#audioParam.linearRampToValueAtTime : this.#audioParam.exponentialRampToValueAtTime

    rampFunc.call(this.#audioParam, this.range.clamp(value), this.#context.time(end))
  }
}
