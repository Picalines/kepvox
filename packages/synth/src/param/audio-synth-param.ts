import { Range } from '@repo/common/math'
import type { SynthContext } from '#context'
import { UNIT_RANGES, type UnitName } from '#units'
import { AudioAutomationCurve } from './audio-automation-curve'
import type { AutomationCurve } from './automation-curve'
import { SynthParam, synthParamType } from './synth-param'

export type AudioSynthParamOpts = {
  context: SynthContext
  unit: UnitName
  initialValue: number
  range?: Range
}

const hasAssociatedParamSymbol = Symbol('associatedSynthAudioParam')

export class AudioSynthParam extends SynthParam {
  readonly [synthParamType] = 'audio'

  readonly unit: UnitName
  readonly range: Range

  readonly #context: SynthContext
  readonly #audioParam: AudioParam
  readonly #curve: AudioAutomationCurve

  constructor(audioParam: AudioParam, opts: AudioSynthParamOpts) {
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
    this.#curve = new AudioAutomationCurve(context, this.#audioParam, { valueRange: this.range })

    this.#audioParam.cancelScheduledValues(0)
    this.#audioParam.setValueAtTime(safeInitialValue, 0)
    this.#curve.setValueAt(this.#context.firstBeat, safeInitialValue)
  }

  get curve(): AutomationCurve {
    return this.#curve
  }

  get initialValue() {
    return this.curve.valueAt(this.#context.firstBeat)
  }

  set initialValue(value: number) {
    this.curve.setValueAt(this.#context.firstBeat, value)
  }
}
